
export function parseTagsFromSkills(tags: string[]): string[] {
  return tags.map((tag) => tag.toLocaleLowerCase("fi"));
}

const images = ['code-1839406_1280.jpg', 'other-1605305495-612x612.jpeg'];


function decorateWithTailwind(html: string): string {
    return "";
}
export function getImageByCategory(category: string): string {
   const index = Math.floor(Math.random() * images.length);
   return images[index];
}



