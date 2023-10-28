import { db } from "@vercel/postgres";

export async function connectToDatabase() {
  const client = await db.connect();
  return client;
}

export async function fetchActiveProviders() {
  const client = await db.connect();
  const results = await client.sql`SELECT * FROM provider where active = true`;
  console.log("GOT active providers: " + results.rowCount);
  await client.end();
  return results.rows;
}

export const ERROR_CODE_ROW_ALREADY_EXISTS = "23505";
export async function saveProject(
  client,
  {
    title,
    subtitle,
    excerpt,
    description,
    slug,
    reference,
    skills,
    tags,
    provider,
    location,
  }
) {
  return await client.sql`insert into project(title, subtitle, excerpt, description, slug, reference, skills, tags, provider, location) values(
        ${title},
        ${subtitle},
        ${excerpt},

        ${description},
        ${slug},
        ${reference},
        ${skills},
        ${tags},
        ${provider},
        ${location}
        )`;
}
