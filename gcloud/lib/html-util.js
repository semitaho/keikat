import fetch from "node-fetch";
import jsdom from "jsdom";
const { JSDOM } = jsdom;

export async function getHTMLProjects({ projectpage_ref, projects_querypath }) {
  console.log('projectpage', projects_querypath);
  const jsdomContent = await fetchHTMLJSDOM(projectpage_ref);
  const linkNodesArr = navigateFromHtml(jsdomContent.window.document, projects_querypath, false, false);
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
  return fetchHTMLJSDOM(href);
}

function parseByType(node, type) {
  switch (type) {
    case "html": 
      return node.innerHTML;
    case "metacontent":
      return node.getAttribute("content");
      default:
      return node.textContent;  
  }

}

export function navigateFromHtml(document, domPath, object = false, textContent = true, type = 'text') {
  const nodes = document.querySelectorAll(domPath);
  const nodesArr = Array.from(nodes);
  if (object) {
    return nodesArr[0] &&  parseByType(nodesArr[0], type);

  }
  if (!textContent) {
    return nodesArr;
  }
  return nodesArr.map(node =>  parseByType(node, type));
}

