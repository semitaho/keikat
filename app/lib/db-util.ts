import { Project } from "../data/project.model";

import { sql } from "@vercel/postgres";
import { SearchParams } from "../data/search-params.model";

export async function loadProjects(search: SearchParams) {
  const active = true;
  const provider = search.provider || '';
  console.log('provider', provider);
  const projektit = await sql`SELECT * FROM project 
  WHERE (active = ${active} OR null = ${active}) AND  (provider = ${provider} OR '' = ${provider})  ORDER BY created_at DESC`;
  return projektit.rows;
}

export async function getProjektiBySlug(slug: string) {
  const results = await sql`SELECT * FROM project WHERE slug = ${slug}`;

  if (results.rows.length) {
    console.log("noniin", results.rows);
    return results.rows[0];
  }
  return null;
}
