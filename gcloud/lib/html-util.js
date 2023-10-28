import fetch from "node-fetch";
import jsdom from "jsdom";
const { JSDOM } = jsdom;

export async function fetchProjectDetailContentJsDOM(href) {
    const response = await fetch(href);
    const content = await response.text();
    return new JSDOM(content);
  }