import { MongoClient, ServerApiVersion } from "mongodb";

export async function connectToDatabase() {
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  const db = await client.db("keikat");
  return db;
}

export async function fetchActiveProviders(db) {
  const results = await db
    .collection("provider")
    .find({ active: true })
    .toArray();
  return results;
}

export const ERROR_CODE_ROW_ALREADY_EXISTS = "23505";
export async function saveProject(db, project) {
  const insert = await db.collection("project").insertOne(project);
  return insert;
}

export async function updateProject(db, project) {
  const updateProject = {
    $set: {
      ...project,
    },
  };
  return await db.collection("project").updateOne({
    _id: project._id
  }, updateProject);
}

export async function getProjectBySlug(slug) {
  const client = await connectToDatabase();
  const results = await client.sql`SELECT * FROM project WHERE slug = ${slug}`;

  if (results.rows.length) {
    return results.rows[0];
  }
  return null;
}

export async function getProjectByReference(db, reference) {
  const result = await db.collection("project").findOne({ reference });
  return result;
}
