import { Project } from "./project.model";

export const CATEGORY_IMAGE_MAP: { [key: string]: string } = {
  java: "code-1839406_1280.jpg",
  azure: "istockphoto-1435220822-1024x1024.jpg",
  other: "other-1605305495-612x612.jpeg",
};

export const projektit: Project[] = [
  {
    category: "java",
    title: "SENIOR UI-devaaja",
    slug: "senior-ui-devaaja",
    tags: ["react", "AngularJs", "Angular", "TailwindCss"],
    skills: [],
    description: "<h3>väliotsake</h3>",
  },
  {
    category: "azure",
    title: "Azure DevOps-Spesialisti",
    slug: "azure-devops-spesialisti",
    tags: [],
    skills: [],
    description:
      " <p>Asiakas etsii monitaho-ohjelmoijaa nyt eikä pian</p><p>Tässä projektissa edellytetään kykyjä!</p>",
  },
  {
    category: "seniordeveloper",
    title: "Senior Developer",
    slug: "senior-developer-1",
    skills: ["Azure", "React Native", "CI/CD", "Azure DevOps"],
    tags: ["azure", "react native", "ci/cd", "azure devops"],
    description: `
   <p>We are looking for a skilled Developer for our client operating in creating transportation solutions. </p>
<p>We hope to find a person who would have expertise from past projects working as in technical architecture development and planning requiring roles but has a lot of hands on coding skills as well! </p>
<p>Needed expertise is following: </p>
<ul>
<li>Solution architecture experience</li>
<li>Backend development experience </li>
<li>React Native development experience </li>
<li>Microsoft Azure Cloud (Microservices, Microsoft Azure,  DevOps,  CI/CD pipelines</li>
</ul>
<p>Start of the project would be end of 2023 or beginning of 2024<br>
Length 12 months.+ <br>
100 % remote.<br>
English and  Finnish skill both required. </p>
<p>More info via karoliina.heikkila@witted.com / slack.</p>

    `,
  },
];

export async function getProjektiBySlug(
  slug: string
): Promise<Project | undefined> {
  return projektit.find((project) => project.slug === slug);
}
