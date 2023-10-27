import { db } from "@vercel/postgres";

export async function connectToDatabase() {
  const client = await db.connect();
  return client;
}

export const ERROR_CODE_ROW_ALREADY_EXISTS = '23505';
export async function saveProject(
  client,
  { title, description, slug, reference, skills, tags, provider }
) {
  return await client.sql`insert into project(title, description, slug, reference, skills, tags, provider) values(
        ${title},
        ${description},
        ${slug},
        ${reference},
        ${skills},
        ${tags},
        ${provider}
        )`;
}
