import fetch from "node-fetch";

import jsdom from "jsdom";
const { JSDOM } = jsdom;

export async function readAllProjectLinks() {
  const response = await fetch("https://wittedpartners.com/projects");
  const content = await response.text();
  const ulNode = new JSDOM(content).window.document.querySelector("ul.wrapper");
  const linkNodes = Array.from(ulNode.querySelectorAll("a"));
  return linkNodes.map((linkNodes) => linkNodes.href);
}

export async function crawlForTitle(jsdom) {
  const title = jsdom.window.document.querySelector("h1").textContent;
  return title;
}

export async function crawlForSkills(jsdom) {
  const allLists = jsdom.window.document.querySelectorAll("li");
  const listsWithSkills = Array.from(allLists)
    .filter((li) => li.textContent.includes("Skills:"))
    .flatMap((li) => Array.from(li.querySelectorAll("a")))
    .map((link) => link.textContent);
  return listsWithSkills;
}


export async function crawlForDescription(jsdom) {
    const description = jsdom.window.document.querySelector(
      "div.wysiwyg"
    );
    return description.innerHTML;
  }
  
