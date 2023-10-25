import { CATEGORY_IMAGE_MAP } from "../data/dummy-data";

export function parseTagsFromSkills(tags: string[]): string[] {
  return tags.map((tag) => tag.toLocaleLowerCase("fi"));
}


function decorateWithTailwind(html: string): string {
    return "";
}
export function getImageByCategory(category: string): string {
    return CATEGORY_IMAGE_MAP[category] || CATEGORY_IMAGE_MAP["other"];
}
