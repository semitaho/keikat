import { Project } from "../data/project.model";

import { 
  sql,
} from "@vercel/postgres";


export async function loadAllProjects() {
  const projektit =
    await sql`SELECT * FROM project ORDER BY created_at DESC`;
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
