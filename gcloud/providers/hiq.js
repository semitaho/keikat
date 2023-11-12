export const settings = {
  slug: {
    path: `$.subContractPage.fields.path`,
    object: true,
  },
  title: {
    path: `$.result.data.contentfulContentPage.title`,
    object: true,
    useSingle: true
  },

  excerpt: {
    path: `$.result.data.contentfulContentPage.preamble.preamble`,
    object: true,
    useSingle: true
  },

  description: {
    path: `$.non`,
    object: true,
    useSingle: true
  },
  skills: {
    path: `$.result.data.contentfulContentPage.pageTeaserText`,
    useSingle: true
  },
  description: {
    path: `$.result.data.contentfulContentPage.bodyText.raw`,
    object: true,
    useSingle: true
  },
};
