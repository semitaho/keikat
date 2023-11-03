import fetch from "node-fetch";
import jp from "jsonpath";

export async function getJSONProjects({ projectpage_ref, projects_querypath }) {
  const response = await fetch(projectpage_ref);
  const jsonProjects = await response.json();
  const navigatedProjects = navigateFromJson(jsonProjects, projects_querypath);
  return navigatedProjects;
}

export function navigateFromJson(json, jsonPath, asObject = false) {
  const result = jp.query(json, jsonPath);
  if (asObject && result.length) {
    return result[0];
  }
  if (asObject && !result.length) {
    return null;
  }
  return result;
}
export async function fetchJSON(jsonlink) {
  const response = await fetch(jsonlink);
  const json = await response.json();
  return json;
}

export function navigateFromJsonPaths(json, jsonPathArray) {
  for (let jsonPath of jsonPathArray) {
    const result = navigateFromJson(json, jsonPath);
    if (result) {
      return result;
    }
  }
  return null;
}
