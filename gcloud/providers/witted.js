import fetch from "node-fetch";

import jsdom from "jsdom";
import { navigateFromHtml } from "../lib/html-util.js";
const { JSDOM } = jsdom;

export async function crawlForTitle(jsdom) {
  const title = jsdom.window.document.querySelector("h1").textContent;
  return title;
}

export async function crawlForLocation(jsdom) {
    const links = Array.from(jsdom.window.document.querySelectorAll("li.links--inverted:last-child a"));
    const locations = links.map(link => link.textContent).join(", ");
    return locations;
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
  
