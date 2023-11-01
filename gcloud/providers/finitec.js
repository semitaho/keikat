export const settings = {
  title: {
    path: `$.pageProps.gig['description_en','description_fi'].title`,
    object: true,
    useSingle:true
  },

  slug: {
    path: `$.id`,
    object: true
  },
  description: {
    path: `$.pageProps.gig['description_en','description_fi'].public_body`,
    object: true,
    useSingle: true
  },
  subtitle: {
    path: `$.pageProps.gig['description_en','description_fi'].subtitle`,
    object: true,
    useSingle: true
  },
  excerpt: {
    path: `$.pageProps.gig['description_en','description_fi'].byline`,
    object: true,
    useSingle: true
  },
  location: {
    path: `$.pageProps.gig['description_en','description_fi'].location`,
    object: true,
    useSingle: true
  },
  skills: {
    path: `$.pageProps.gig.categories[*]`,
    useSingle: true
  }
};
