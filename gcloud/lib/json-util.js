import fetch from "node-fetch";

export function navigateFromJson(json, jsonPath) {
  const paths = jsonPath.split(".");
  let currentPosition = json;
  for (let path of paths) {
    if (Array.isArray(currentPosition)) {
      currentPosition = currentPosition
        .filter((item) => item[path])
        .flatMap((item) => {
          if (Array.isArray(item[path])) {
            return item[path];
          }
          return [item[path]];
        });
    } else {
      currentPosition = currentPosition[path];
    }
    if (!currentPosition) {
      return null;
    }
  }
  return currentPosition;
}
export function get(obj, path) {
  // if path is not a string or array of string
  if (path === "" || path.length == 0) return undefined;

  // if path is an array, concatenate it and form a string
  // to handle a single case of string
  if (Array.isArray(path)) path = path.join(".");

  // filter out the brackets and dot
  let exactPath = [];
  for (let i = 0; i < path.length; i++) {
    if (path[i] !== "[" && path[i] !== "]" && path[i] !== ".") {
      exactPath.push(path[i]);
    }
  }

  // get the value of the path in the sequence
  const value = exactPath.reduce((source, path) => source[path], obj);

  // if not found return undefined
  return value ? value : undefined;
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
