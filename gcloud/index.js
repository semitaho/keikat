import functions from "@google-cloud/functions-framework";
import {
  ERROR_CODE_ROW_ALREADY_EXISTS,
  connectToDatabase,
  fetchActiveProviders,
  getProjectByReference,
  getProjectBySlug,
  saveProject,
  updateProject,
} from "./lib/db-util.js";
import {
  fetchJSON,
  getJSONProjects,
  navigateFromJson,
  navigateFromJsonPaths,
} from "./lib/json-util.js";
import {
  fetchHTMLJSDOM,
  getHTMLProjects,
  navigateFromHtml,
} from "./lib/html-util.js";
import { parseDate } from "./lib/parser-util.js";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
function parseTagsFromSkills(skills) {
  if (!skills) {
    return [];
  }
  return skills.map((skill) => skill.toLocaleLowerCase("fi"));
}

async function readProviders(client) {
  const activeProviders = await fetchActiveProviders(client);
  return activeProviders;
}

functions.http("updateGigs", async (req, res) => {
  if (req.get("API_KEY") !== process.env.API_KEY) {
    res.status(401).send("Not authorized with API_KEY: " + req.get("API_KEY"));
    return;
  }

  const db = await connectToDatabase();
  const providers = await readProviders(db);
  for (const provider of providers) {
    const { fetch_type } = provider;
    switch (fetch_type) {
      case "HTML":
        await iterateHTMLProjects(db, provider);
        break;
      case "JSON":
        await iterateJSONProjects(db, provider);
        break;
      case "JSONHTML":
        await iterateJSONHTMLProjects(db, provider);
        break;
      case "JSONCOMMON":
        await iterateJSONCOMMONProjects(provider);
        break;

      default:
        console.warn("INVALID fetch type: " + fetch_type);
        break;
    }
  }

  res.send(`Hello: providers: ${providers}`);
});

async function checkAndSaveProject(db, projectObj) {
  try {
    if (projectObj._id) {
      await updateProject(db, projectObj);
      console.log("project UPDATED with slug", projectObj.slug);
    } else {
      await saveProject(db, projectObj);
      console.log("project CREATED with slug", projectObj.slug);
    }
  } catch (error) {
    if (error.code === ERROR_CODE_ROW_ALREADY_EXISTS) {
      console.log("PROJECT already exists in db, slug: " + projectObj.slug);
    } else {
      console.error(error);
    }
  }
}

async function iterateHTMLProjects(db, provider) {
  const navigatedProjects = await getHTMLProjects(provider);
  const { provider_id } = provider;
  const { settings, readSlug } = await import(
    "./providers/" + provider.provider_id + ".js"
  );
  for (const navigatedProject of navigatedProjects) {
    const slug = readSlug
      ? readSlug(navigatedProject)
      : navigateFromHtml(
          navigatedProject,
          settings.slug.path,
          settings.slug.object,
          false
        );
    const projectObj = await initProject(db, provider, slug);
    projectObj.slug = slug;
    const projectlink = provider.projectdetailpage_ref.replace("{slug}", slug);
    const jsDom = await fetchHTMLJSDOM(projectlink);
    Object.keys(settings).forEach((settingkey) => {
      const { path, useSingle, object, type } = settings[settingkey];
      projectObj[settingkey] = navigateFromHtml(
        useSingle ? jsDom.window.document : navigatedProject,
        path,
        object,
        true,
        type
      );
    });
    projectObj.tags = parseTagsFromSkills(projectObj.skills);
    projectObj.provider = provider_id;
    await checkAndSaveProject(db, projectObj);
  }
}

async function iterateJSONProjects(db, provider) {
  const navigatedProjects = await getJSONProjects(provider);
  const { provider_id, homepage } = provider;

  const { settings } = await import(
    "./providers/" + provider.provider_id + ".js"
  );
  for (const project of navigatedProjects) {
    const slug = navigateFromJson(
      project,
      settings.slug.path,
      settings.slug.object
    ).replace(homepage, "");
    console.log("slug", slug);
    const projectlink = provider.projectdetailpage_ref.replace("{slug}", slug);
    const projectObj = await initProject(db, provider, projectlink);
    projectObj.slug = slug;
    const projectDetailJson = await fetchJSON(projectlink);

    Object.keys(settings).forEach((settingkey) => {
      const { path, object, useSingle } = settings[settingkey];
      projectObj[settingkey] = navigateFromJson(
        useSingle ? projectDetailJson : project,
        path,
        object
      );
    });
    projectObj.tags = parseTagsFromSkills(projectObj.skills);
    await checkAndSaveProject(db, projectObj);

    /*

   
    projectObj.created_at = navigateFromJsonPaths(json, [
      "pageProps.gig.published_at",
    ]);
    projectObj.start_date = parseDate(
      navigateFromJsonPaths(json, [
        "pageProps.gig.description_fi.starts_at",
        "pageProps.gig.description_en.starts_at",
      ])
    );
     
  */
  }
}

async function iterateJSONHTMLProjects(db, provider) {
  const navigatedProjects = await getJSONProjects(provider);
  const { provider_id, homepage } = provider;

  const { settings } = await import(
    "./providers/" + provider.provider_id + ".js"
  );
  for (const project of navigatedProjects) {
    const slug = navigateFromJson(
      project,
      settings.slug.path,
      settings.slug.object
    ).replace(homepage, "");
    const projectlink = provider.projectdetailpage_ref.replace("{slug}", slug);
    const projectObj = await initProject(db, provider, projectlink);
    projectObj.slug = slug;
    const jsDom = await fetchHTMLJSDOM(projectlink);
    Object.keys(settings).forEach((settingkey) => {
      const { path, useSingle, object, type } = settings[settingkey];
      projectObj[settingkey] = useSingle
        ? navigateFromHtml(jsDom.window.document, path, object, true, type)
        : navigateFromJson(project, path, object, type) ? navigateFromJson(project, path, object, type) : null;
    });
    console.log("projectobj", projectObj);
    projectObj.tags = parseTagsFromSkills(projectObj.skills);
    await checkAndSaveProject(db, projectObj);

    /*

   
    projectObj.created_at = navigateFromJsonPaths(json, [
      "pageProps.gig.published_at",
    ]);
    projectObj.start_date = parseDate(
      navigateFromJsonPaths(json, [
        "pageProps.gig.description_fi.starts_at",
        "pageProps.gig.description_en.starts_at",
      ])
    );
     
  */
  }
}

async function iterateJSONCOMMONProjects(provider) {
  const navigatedProjects = await getJSONProjects(provider);
  const client = await connectToDatabase();

  for (const project of navigatedProjects) {
    const projectObj = await initProject(client, provider, project.id);
    projectObj.provider = provider.provider_id;
    projectObj.slug = navigateFromJson(project, "id");
    projectObj.title = navigateFromJsonPaths(project, ["title"]);
    /*
    projectObj.subtitle = navigateFromJsonPaths(project, [
      "description_fi.subtitle",
      "description_en.subtitle",
    ]);
   
    projectObj.excerpt = navigateFromJsonPaths(json, [
      "pageProps.gig.description_fi.byline",
      "pageProps.gig.description_en.byline",
    ]);
    */
    projectObj.description = navigateFromJsonPaths(project, ["description"]);
    projectObj.skills = navigateFromJsonPaths(project, [
      "required_skills.name",
    ]);
    projectObj.location = (
      navigateFromJsonPaths(project, ["locations"]) || []
    ).join(", ");
    projectObj.created_at = navigateFromJsonPaths(project, ["created_at"]);
    projectObj.start_date = parseDate(
      navigateFromJsonPaths(project, ["starting_date"])
    );
    projectObj.tags = parseTagsFromSkills(projectObj.skills);

    await checkAndSaveProject(client, projectObj);
  }
}

async function initProject(db, provider, reference) {
  const project = await getProjectByReference(db, reference);
  const currentDate = new Date();
  return (
    (project && {
      ...project,
      updated_at: currentDate,
      active: true,
    }) || {
      provider: provider.provider_id,
      created_at: currentDate,
      reference,
      active: true,
    }
  );
}
