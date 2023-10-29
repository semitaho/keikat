import functions from "@google-cloud/functions-framework";
import fetch from "node-fetch";

import {
  ERROR_CODE_ROW_ALREADY_EXISTS,
  connectToDatabase,
  fetchActiveProviders,
  saveProject,
} from "./lib/db-util.js";
import {
  fetchJSON,
  navigateFromJson,
  navigateFromJsonPaths,
} from "./lib/json-util.js";
import { fetchProjectDetailContentJsDOM } from "./lib/html-util.js";
import { parseDate } from "./lib/parser-util.js";

const providerInfo = {
  title: "crawlForTitle",
  skills: "crawlForSkills",
  description: "crawlForDescription",
  location: "crawlForLocation",
};

function parseTagsFromSkills(skills) {
  return skills.map((skill) => skill.toLocaleLowerCase("fi"));
}

async function readProviders() {
  const activeProviders = await fetchActiveProviders();
  return activeProviders;
}

async function iterateHTMLProjects(provider, providerpath, projects) {
  const client = await connectToDatabase();
  for (const projectlink of projects) {
    const projectObj = {};
    projectObj["reference"] = projectlink;
    projectObj["provider"] = provider;
    const jsDomObject = await fetchProjectDetailContentJsDOM(projectlink);
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
    try {
      await saveProject(client, projectObj);
      console.log("project created with slug", projectObj.slug);
    } catch (error) {
      if (error.code === ERROR_CODE_ROW_ALREADY_EXISTS) {
        console.log("PROJECT already exists in db, slug: " + projectObj.slug);
      } else {
        console.error(error);
      }
    }
  }
}

functions.http("updateGigs", async (req, res) => {
  if (req.get("API_KEY") !== process.env.API_KEY) {
    res.status(401).send("Not authorized with API_KEY: " + req.get("API_KEY"));
    return;
  }

  const providers = await readProviders();
  for (const provider of providers) {
    const { provider_id, fetch_type, projectpage_ref } = provider;
    switch (fetch_type) {
      /*
      case "HTML":
        const { readAllProjectLinks } = await import(providerPath);
        const links = await readAllProjectLinks(projectpage_ref);
        await iterateHTMLProjects(provider_id, providerPath, links);
        break;
        */
      case "JSON":
        await iterateJSONProjects(provider);
        break;

      default:
        console.warn("INVALID fetch type: " + fetch_type);
        break;
    }
  }

  res.send(`Hello handsome!: providers: ${providers}`);
});

async function iterateJSONProjects(provider) {
  const response = await fetch(provider.projectpage_ref);
  const jsonProjects = await response.json();
  const navigatedProjects = navigateFromJson(
    jsonProjects,
    "pageProps.initialState.gigs.gigs"
  );
  const client = await connectToDatabase();

  for (const project of navigatedProjects) {
    const projectlink = `https://www.finitec.fi/_next/data/hxDzwjrwa0s34NpTAoCph/fi/gigs/${project.id}.json`;
    const projectObj = {
      reference: projectlink,
      slug: project.id,
      provider: provider.provider_id,
    };

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
      "pageProps.gig.published_at"
    ]);
    projectObj.start_date =  parseDate(navigateFromJsonPaths(json, [
      "pageProps.gig.description_fi.starts_at",
      "pageProps.gig.description_en.starts_at",
    ]));
    console.log('starts at',  projectObj.start_date);

    
    projectObj.tags = parseTagsFromSkills(projectObj.skills);
    
    await saveProject(client, projectObj);
    console.log("project created with slug", projectObj.slug);

  }
}
