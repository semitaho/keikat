import fetch from "node-fetch";

export function navigateFromJson(json, jsonPath) {
  const paths = jsonPath.split(".");
  let currentPosition = json;
  for (let path of paths) {
    currentPosition = currentPosition[path];
    if (!currentPosition) {
      return null;
    }
  }
  return currentPosition;
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
