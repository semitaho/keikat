import functions from "@google-cloud/functions-framework";
import fetch from "node-fetch";
import fs, { link } from "fs";
import path from "path";

import jsdom from "jsdom";
import {
  ERROR_CODE_ROW_ALREADY_EXISTS,
  connectToDatabase,
  saveProject,
} from "./lib/db-util.js";
const { JSDOM } = jsdom;

const providerInfo = {
  title: "crawlForTitle",
  skills: "crawlForSkills",
  description: "crawlForDescription",
};

function parseTagsFromSkills(skills) {
  return skills.map((skill) => skill.toLocaleLowerCase("fi"));
}


async function readProviders() {
  const providersPath = path.join(process.cwd(), "providers");
  const providerFiles = fs.readdirSync(providersPath);
  return providerFiles.map((providerFile) =>
    providerFile.substring(0, providerFile.lastIndexOf("."))
  );
}

async function iterateProjects(provider, providerpath, projects) {
  const projectObj = {};
  const client = await connectToDatabase();
  for (const projectlink of projects) {
    projectObj["reference"] = projectlink;
    projectObj["provider"] = provider;
    const content = await fetchProjectDetailContent(projectlink);
    const jsDomObject = new JSDOM(content);
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
    const providerPath = `./providers/${provider}.js`;
    const { readAllProjectLinks } = await import(providerPath);
    const links = await readAllProjectLinks();
    iterateProjects(provider, providerPath, links);
  }

  /*
  const response = await fetch("https://wittedpartners.com/projects");
  const content = await response.text();
  const ulNode = new JSDOM(content).window.document.querySelector("ul.wrapper");
  const linkNodes = ulNode.querySelectorAll("a");
  const maxAmountOfProjets = 11;

  for (let index = 0; index < maxAmountOfProjets; index++) {
    console.log(`Content index ${index} fetched.`);
    const keys = Object.keys(providerInfo);
    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
      const projectKey = keys[keyIndex];
      console.log(`START map index: ${index}, key: ${projectKey}`);
      const value = await providerInfo[projectKey](content);
      console.log(
        `END map index: ${index}, key: ${projectKey}, value: ${value}`
      );
      console.log("----");
    }

    console.log("Assigment number " + index + " crawled success!\n");
  }

  */
  res.send(`Hello handsome!: providers: ${providers}`);
});
async function fetchProjectDetailContent(href) {
  const response = await fetch(href);
  const content = await response.text();
  return content;
}
