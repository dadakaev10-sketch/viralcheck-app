export default function sitemap() {
  return [
    {
      url: 'https://viralcheck.me',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          de: 'https://viralcheck.me/?lang=de',
          en: 'https://viralcheck.me/?lang=en',
          ru: 'https://viralcheck.me/?lang=ru',
        },
      },
    },
    {
      url: 'https://viralcheck.me/privacy',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}
