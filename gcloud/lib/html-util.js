import fetch from "node-fetch";
import jsdom from "jsdom";
const { JSDOM } = jsdom;

export async function getHTMLProjects({ projectpage_ref, projects_querypath }) {
  const jsdomContent = await fetchHTMLJSDOM(projectpage_ref);
  const linkNodesArr = navigateFromHtml(jsdomContent, projects_querypath);
  return linkNodesArr;
}

export async function fetchHTMLJSDOM(url) {
  const response = await fetch(url);
  const text = await response.text();
  const jsdomContent = new JSDOM(
    text.replace(/<style(\s|>).*?<\/style>/gi, "")
  );
  return jsdomContent;
}

export async function fetchProjectDetailContentJsDOM(href) {
  const response = await fetch(href);
  const content = await response.text();
  return new JSDOM(content);
}

export function navigateFromHtml(jsDom, domPath, single = false) {
  const nodes = jsDom.window.document.querySelectorAll(domPath);
  const nodesArr = Array.from(nodes);
  if (single) {
    return nodesArr[0];

  }
  return nodesArr;
}
