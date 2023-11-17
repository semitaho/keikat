import fetch from "node-fetch";
import jp from "jsonpath";
import { parseRegexp } from "./parser-util.js";

export async function getJSONProjects({ projectpage_ref, projects_querypath }) {
  const response = await fetch(projectpage_ref);
  const jsonProjects = await response.json();
  const navigatedProjects = navigateFromJson(jsonProjects, projects_querypath);
  return navigatedProjects;
}

function parseByType(text, type) {
  switch (type) {
    case "slugfromlink": {
      return parseRegexp(text, /\/([^\/]+)$/);
    }
    case "finnishdate": 
      const dateResult = parseRegexp(text,  /\d+\.\d+\.\d+/);
      if (!dateResult) return null;
      const [day, month, year] =  dateResult.split(".");
      if (day > 1900) {
        return new Date(day, month-1, year);
 
      }
      return new Date(year, month-1, day);
    default:
      return text;

  }

}

export function navigateFromJson(json, jsonPath, asObject = false, type = null) {
  const result = jp.query(json, jsonPath);
  if (asObject && result.length) {
    return parseByType(result[0], type);
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
