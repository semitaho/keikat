export const settings = {
  title: {
    path: 'h1',
    object: true,
    useSingle: true
  },

  skills: {
    path: 'ul > li:nth-child(2) > div > a',
    object: false,
    useSingle: true
  },

  description: {
    path: '.ingress',
    object: true,
    useSingle: true,
    type: 'html'
  },

  excerpt: {
    path: 'meta[name="description"]',
    object: true,
    useSingle: true,
    type: 'metacontent'
  },

};


export function readSlug(project) {
  const href = project.querySelector('a').getAttribute("href");
  return href.substring(href.lastIndexOf("/")+1);

}