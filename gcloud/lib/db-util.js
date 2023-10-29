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
export async function saveProject(client, project) {
  const fields = Object.keys(project).filter((field) => project[field]);
  const values = fields.map((field) => project[field]);
  let valueStr = values.map((_, index) => `$${index + 1}`).join(", ");

  let sqlToInsert = `insert into project(${fields.join(", ")}) values(`;
  sqlToInsert += valueStr;
  sqlToInsert += ")";
  return await client.query(sqlToInsert, values);
}
