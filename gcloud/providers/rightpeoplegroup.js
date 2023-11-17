export const settings = {
  slug: {
    path: `$.link`,
    object: true,
    type: 'slugfromlink'
  },

  title: {
    path: '$.title',
    object: true
  },
  created_at: {
    path: '$.title',
    object: true,
    type: 'finnishdate'
  },

  excerpt: {
    path: 'meta[name="description"]',
    object: true,
    useSingle: true,
    type: 'metacontent'

  },
};
