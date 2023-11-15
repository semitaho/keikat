import { Project } from "../data/project.model";

import { SearchParams } from "../data/search-params.model";
import { QuerySearchParameters } from "../data/query-search-parameters.model";

import { Db, Document, MongoClient, ServerApiVersion } from "mongodb";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client: MongoClient = new MongoClient(process.env.MONGODB_URI as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});
const db = client.db("keikat");

function createInSearchFilter(fieldName: string, query: string): Document {
  return {
    $search: {
      index: "freesearchIdx", // optional, defaults to "default"
      queryString: {
        defaultPath: fieldName,
        query,
      },
    },
  };
}
export async function loadProjects(search: QuerySearchParameters) {
  let aggregates: Document[] = [];
  let filters: { [key: string]: string } = {};
  const defaultPaths = [];

  if (search.skills && search.skills.length) {
    defaultPaths.push("skills");
    filters.skills = search.skills;
  }
  if (search.providers && search.providers.length) {
    filters.provider = search.providers;
    defaultPaths.push("provider");
  }

  if (search.search && search.search.length) {
    filters.description = `${search.search}`;
    defaultPaths.push("description");
  }

  const queryString = defaultPaths.length
    ? {
        queryString: {
          defaultPath: defaultPaths.join(","),
          query: Object.keys(filters)
            .map((filter) => `${filter}:${filters[filter]}`)
            .join(" OR "),
        },
      }
    : {};

  if (Object.keys(queryString).length) {
    aggregates.push({
      $search: {
        index: "freesearchIdx",
        ...queryString,
      },
    });
  }

  aggregates.push({
    $sort: { created_at: -1 }
  });
  
  /*
  let filter = { ...skillFilter };

  console.log("filter", filter);
  
  if (Object.keys(filter).length) {
    aggregates.push(filter);
  }
*/
  const results = await db
    .collection("project")
    .aggregate(aggregates)
    .toArray();
  return results;
}

export async function getAllSkills() {
  const skills = await db
    .collection("project")
    .find({ active: true })
    .project({ skills: 1 })
    .toArray();
  return skills
    .flatMap((result) => result.skills)
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort((skill1: string, skill2: string) =>
      skill1.toLocaleLowerCase().localeCompare(skill2)
    );

  /*
  const results =
    await sql`SELECT distinct unnest(skills) as singleskills from project`;
  return results.rows
    .map((row) => row.singleskills)
    .sort((a: string, b: string) =>
      a.toLowerCase().localeCompare(b.toLowerCase())

    );
    */
}

export async function getAllProviders() {
  const skills = await db
    .collection("project")
    .find({ active: true })
    .project({ provider: 1 })
    .toArray();
  return skills
    .map((result) => result.provider)
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort((skill1: string, skill2: string) =>
      skill1.toLocaleLowerCase().localeCompare(skill2)
    );
}

export async function getProjektiBySlug(slug: string) {
  return null;
  /*
  const results = await sql`SELECT * FROM project WHERE slug = ${slug}`;

  if (results.rows.length) {
    console.log("noniin", results.rows);
    return results.rows[0];
  }
  return null;
  */
}
