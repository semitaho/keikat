import { Project } from "../data/project.model";

import { VercelPoolClient, db } from "@vercel/postgres";

 async function connectToDatabase(): Promise<VercelPoolClient> {
  const client = await db.connect();
  return client;
}

export async function loadAllProjects() {
    const client = await connectToDatabase();
    const projektit = await client.sql`SELECT * FROM project`;
    return projektit.rows;
}

export async function getProjektiBySlug(slug: string) {
    const client = await connectToDatabase();
    const results = await client.sql`SELECT * FROM project WHERE slug = ${slug}`;
    if (results.rows.length) {
        console.log('noniin', results.rows);
        return results.rows[0];
    }
    return null;
}