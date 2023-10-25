export const CATEGORY_IMAGE_MAP = {
  java: "code-1839406_1280.jpg",
  azure: "istockphoto-1435220822-1024x1024.jpg",
};

export const projektit = [
  {
    category: "java",
    title: "SENIOR UI-devaaja",
    slug: "senior-ui-devaaja",
    tags: ["react", "AngularJs", "Angular", "TailwindCss"],
    excerpt:
      "Asiakas etsii pitkään toimeksiantoon osaajaa, josta ei voi välttyä.",
    description: "<h3>väliotsake</h3>",
  },
  {
    category: "azure",
    title: "Azure DevOps-Spesialisti",
    slug: "azure-devops-spesialisti",
    tags: [],
    excerpt:
      "Asiakas etsii pitkään toimeksiantoon osaajaa, josta ei voi välttyä.",
    description:
      " <p>Asiakas etsii monitaho-ohjelmoijaa nyt eikä pian</p><p>Tässä projektissa edellytetään kykyjä!</p>",
  },
];

export async function getProjektiBySlug(slug) {
  return projektit.find((project) => project.slug === slug);
}
