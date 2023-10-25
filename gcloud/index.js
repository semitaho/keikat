const functions = require("@google-cloud/functions-framework");
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { link } = require("fs/promises");
const { JSDOM } = jsdom;

const providerInfo = {
  title: crawlForTitle,
  skills: crawlForSkills,
  description: crawlForDescription,
  tags: crawlForTags,
};

async function crawlForTitle(pageContent) {
  const title = new JSDOM(pageContent).window.document.querySelector(
    "h1"
  ).textContent;
  return title;
}

async function crawlForDescription(pageContent) {
  const description = new JSDOM(pageContent).window.document.querySelector(
    "div.wysiwyg"
  );
  return description.innerHTML;
}

function parseTagsFromSkills(tags) {
  return tags.map((tag) => tag.toLocaleLowerCase("fi"));
}

async function crawlForSkills(pageContent) {
  const allLists = new JSDOM(pageContent).window.document.querySelectorAll(
    "li"
  );
  const listsWithSkills = Array.from(allLists)
    .filter((li) => li.textContent.includes("Skills:"))
    .flatMap((li) => Array.from(li.querySelectorAll("a")))
    .map((link) => link.textContent);
  console.log("skills", listsWithSkills);
  return listsWithSkills;
}
async function crawlForTags(pageContent) {
  const crawlForSkills = await crawlForSkills(pageContent);
  return parseTagsFromSkills(crawlForSkills);
}

functions.http("updateGigs", async (req, res) => {
  if (req.get("API_KEY") !== process.env.API_KEY) {
    res.status(401).send("Not authorized with API_KEY: " + req.get("API_KEY"));
    return;
  }

  const response = await fetch("https://wittedpartners.com/projects");
  const content = await response.text();
  const ulNode = new JSDOM(content).window.document.querySelector("ul.wrapper");
  const linkNodes = ulNode.querySelectorAll("a");
  const maxAmountOfProjets = 11;

  for (let index = 0; index < maxAmountOfProjets; index++) {
    const content = await fetchProjectDetailContent(linkNodes, index);
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

  res.send(`Hello handsome!`);
});
async function fetchProjectDetailContent(linkNodes, index) {
  const href = linkNodes[index].href;
  console.log("GOT href!", href);
  const response = await fetch(linkNodes[index].href);
  const content = await response.text();
  return content;
}
