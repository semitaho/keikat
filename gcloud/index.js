import functions from "@google-cloud/functions-framework";
import fetch from "node-fetch";

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
  get,
  navigateFromJson,
  navigateFromJsonPaths,
} from "./lib/json-util.js";
import {
  fetchHTMLJSDOM,
  navigateFromHtml,
  readAllProjectLinks,
} from "./lib/html-util.js";
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
    const { provider_id, fetch_type, projectpage_ref, projects_querypath } =
      provider;
    switch (fetch_type) {
      case "HTML":
        // await iterateHTMLProjects(client, provider);

        //provider_id, providerPath, links);

        //const providerPath = `./providers/${provider_id}.js`;
        //const { readAllProjectLinks } = await import(providerPath);
        /*
        
        const links = await readAllProjectLinks(projectpage_ref);
         */
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

  res.send(`Hello handsome!: providers: ${providers}`);
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

async function iterateHTMLProjects(
  client,
  { projectpage_ref, projects_querypath, provider_id }
) {
  const projectlinks = await readAllProjectLinks(
    projectpage_ref,
    projects_querypath
  );
  console.log("links", projectlinks);

  for (const projectlink of projectlinks) {
    const projectObj = await initProject(client, projectlink);
    const jsDom = await fetchHTMLJSDOM(projectlink);
    projectObj.title = navigateFromHtml(jsDom, "h1", true).textContent;
    console.log("titlte", projectObj.title);
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

function parseSlug(link) {
  if (link.includes("GG-")) {
    return link.substr(link.indexOf("GG-"), link.lastIndexOf("/"));
  }
  return link.substr(link.lastIndexOf("/") + 1);
}

async function iterateJSONProjects(provider) {
  const navigatedProjects = await getJSONProjects(provider);

  const client = await connectToDatabase();

  for (const project of navigatedProjects) {
    const projectlink = `https://www.finitec.fi/_next/data/hxDzwjrwa0s34NpTAoCph/fi/gigs/${project.id}.json`;
    const projectObj = await initProject(projectlink);
    console.log("project processing with slug", projectObj.slug);
    const json = await fetchJSON(projectlink);
    projectObj.title = navigateFromJsonPaths(project, [
      "description_fi.title",
      "description_en.title",
    ]);
    projectObj.subtitle = navigateFromJsonPaths(project, [
      "description_fi.subtitle",
      "description_en.subtitle",
    ]);
    projectObj.excerpt = navigateFromJsonPaths(json, [
      "pageProps.gig.description_fi.byline",
      "pageProps.gig.description_en.byline",
    ]);
    projectObj.description = navigateFromJsonPaths(json, [
      "pageProps.gig.description_fi.public_body",
      "pageProps.gig.description_en.public_body",
    ]);
    projectObj.skills = navigateFromJsonPaths(json, [
      "pageProps.gig.categories",
    ]);
    projectObj.location = navigateFromJsonPaths(json, [
      "pageProps.gig.description_fi.location",
      "pageProps.gig.description_en.location",
    ]);
    projectObj.created_at = navigateFromJsonPaths(json, [
      "pageProps.gig.published_at",
    ]);
    projectObj.start_date = parseDate(
      navigateFromJsonPaths(json, [
        "pageProps.gig.description_fi.starts_at",
        "pageProps.gig.description_en.starts_at",
      ])
    );
    projectObj.tags = parseTagsFromSkills(projectObj.skills);
    await checkAndSaveProject(client, projectObj);
  }
}

async function getJSONProjects(provider) {
  const response = await fetch(provider.projectpage_ref);
  const jsonProjects = await response.json();
  const navigatedProjects = navigateFromJson(
    jsonProjects,
    provider.projects_querypath
  );
  return navigatedProjects;
}

async function iterateJSONCOMMONProjects(provider) {
  const navigatedProjects = await getJSONProjects(provider);
  const client = await connectToDatabase();

  for (const project of navigatedProjects) {
    const projectObj = await initProject(client, project.id);
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
    projectObj.location = (navigateFromJsonPaths(project, ["locations"]) || []).join(", ");
    projectObj.created_at = navigateFromJsonPaths(project, ["created_at"]);
    projectObj.start_date = parseDate(
      navigateFromJsonPaths(project, ["starting_date"])
    );
    projectObj.tags = parseTagsFromSkills(projectObj.skills);
   
    await checkAndSaveProject(client, projectObj);
    
  }
}

async function initProject(client, reference) {
  const project = await getProjectByReference(client, reference);
  return (
    (project && { ...project, updated_at: new Date() }) || {
      reference,
    }
  );
}
