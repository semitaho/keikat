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
import { fetchHTMLJSDOM, getHTMLProjects, navigateFromHtml } from "./lib/html-util.js";
import { parseDate } from "./lib/parser-util.js";

function parseTagsFromSkills(skills) {
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

  const client = await connectToDatabase();

  const providers = await readProviders(client);
  for (const provider of providers) {
    const { fetch_type } = provider;
    switch (fetch_type) {
      case "HTML":
        await iterateHTMLProjects(provider);
        break;
      case "JSON":
        await iterateJSONProjects(provider);
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

async function checkAndSaveProject(client, projectObj) {
  try {
    if (projectObj.project_id) {
      await updateProject(client, projectObj);
      console.log("project UPDATED with slug", projectObj.slug);
    } else {
      await saveProject(client, projectObj);
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

function parseSlug(link) {
  if (link.includes("GG-")) {
    return link.substr(link.indexOf("GG-"), link.lastIndexOf("/"));
  }
  return link.substr(link.lastIndexOf("/") + 1);
}

async function iterateHTMLProjects(provider) {
  const navigatedProjects = await getHTMLProjects(provider);
  console.log('projects', navigatedProjects.length);

  const client = await connectToDatabase();

  
  for (const navigatedProject of navigatedProjects) {
    console.log('content', navigatedProject.innerHTML);

    /*
    const projectObj = await initProject(client, { provider_id }, projectlink);
    const jsDom = await fetchHTMLJSDOM(projectlink);
    projectObj.title = navigateFromHtml(jsDom, "h1", true).textContent;
    projectObj.provider = provider_id;
    projectObj.slug = parseSlug(projectlink);
    projectObj.description = navigateFromHtml(
      jsDom,
      "section p.text-base",
      true
    ).innerHTML;
    console.log("slug käsitelty", projectObj.description);

    await checkAndSaveProject(client, projectObj);

    /*
    projectObj["provider"] = provider;
    const keys = Object.keys(providerInfo);
    const importedData = await import(providerpath);
    for (const key of keys) {
      const fnName = providerInfo[key];
      if (importedData[fnName]) {
        projectObj[key] = await importedData[fnName](jsDomObject);
      } else {
        console.warn("please create  function:" + fnName);
      }
    }
    if (projectObj.skills) {
      projectObj.tags = parseTagsFromSkills(projectObj.skills);
    }
    if (projectObj.reference) {
      projectObj.slug = projectlink.substring(projectlink.lastIndexOf("/") + 1);
    }
  }
  */
  }
  
}

async function iterateJSONProjects(provider) {
  const navigatedProjects = await getJSONProjects(provider);
  const client = await connectToDatabase();

  const { settings } = await import(
    "./providers/" + provider.provider_id + ".js"
  );
  for (const project of navigatedProjects) {
    const slug = navigateFromJson(
      project,
      settings.slug.path,
      settings.slug.object
    );

    const projectlink = provider.projectdetailpage_ref.replace("{slug}", slug);
    const projectObj = await initProject(client, provider, projectlink);
    const projectDetailJson = await fetchJSON(projectlink);
    Object.keys(settings).forEach((settingkey) => {
      const { path, object, useSingle } = settings[settingkey];
      projectObj[settingkey] = navigateFromJson(
        useSingle ? projectDetailJson : project,
        path,
        object
      );
      console.log(settingkey, projectObj[settingkey]);
    });
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
    projectObj.tags = parseTagsFromSkills(projectObj.skills);

    await checkAndSaveProject(client, projectObj);
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

async function initProject(client, provider, reference) {
  const project = await getProjectByReference(client, reference);
  return (
    (project && {
      ...project,
      updated_at: new Date(),
    }) || {
      provider: provider.provider_id,
      reference,
    }
  );
}
