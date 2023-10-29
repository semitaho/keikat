import { db } from "@vercel/postgres";

export async function connectToDatabase() {
  const client = await db.connect();
  return client;
}

export async function fetchActiveProviders(client) {
  const results = await client.sql`SELECT * FROM provider where active = true`;
  console.log("GOT active providers: " + results.rowCount);
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

export async function updateProject(client, project) {
  const fields = Object.keys(project)
    .filter((field) => field !== "project_id")
    .filter((field) => project[field]);
  const valueArray = fields.map((field) => project[field]);
  const values = fields.map((field, index) => `${field} =  $${index + 1}`);
  let valueStr = values.join(", ");
  let sqlToUpdate =
    `UPDATE project SET ${valueStr} where project_id = ` + project.project_id;
  return await client.query(sqlToUpdate, valueArray);
}

export async function getProjectBySlug(slug) {
  const client = await connectToDatabase();
  const results = await client.sql`SELECT * FROM project WHERE slug = ${slug}`;

  if (results.rows.length) {
    return results.rows[0];
  }
  return null;
}

export async function getProjectByReference(client, reference) {
  console.log("with ref", reference);

  const results =
    await client.sql`SELECT * FROM project WHERE reference = ${reference}`;

  if (results.rows.length) {
    return results.rows[0];
  }
  return null;
}
