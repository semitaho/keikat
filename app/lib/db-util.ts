import { Project } from "../data/project.model";

import { sql } from "@vercel/postgres";
import { SearchParams } from "../data/search-params.model";
import { QuerySearchParameters } from "../data/query-search-parameters.model";

export async function loadProjects(search: QuerySearchParameters) {
  console.log("search", search);
  const active = true;
  const provider = search.provider || "";
  const skills = (search.skills && `{${search.skills}}`) || `{}`;
  console.log("skills", skills);

  const searchVal =
    search.search && search.search != "" ? `${search.search}:*` : "";
  const projektit = await sql`SELECT * FROM project 
  WHERE active = ${active} 
  AND  (provider = ${provider} OR '' = ${provider})
  AND  ('' = ${searchVal} OR (search @@ to_tsquery('finnish', ${searchVal})))  

  AND  (skills @> ${skills} )  
  ORDER BY created_at DESC`;
  return projektit.rows;
}

export async function getAllSkills() {
  const results =
    await sql`SELECT distinct unnest(skills) as singleskills from project`;
  return results.rows
  .map(row => row.singleskills)
  .sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

export async function getProjektiBySlug(slug: string) {
  const results = await sql`SELECT * FROM project WHERE slug = ${slug}`;

  if (results.rows.length) {
    console.log("noniin", results.rows);
    return results.rows[0];
  }
  return null;
}
