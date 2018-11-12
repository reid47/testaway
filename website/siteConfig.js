const siteConfig = {
  title: 'Testaway',
  tagline: 'A JavaScript testing library',
  url: 'https://testaway.io',
  baseUrl: '/',

  repoUrl: 'https://github.com/reid47/testaway',
  projectName: 'testaway',
  organizationName: 'reid47',

  headerLinks: [
    { doc: 'get-started', label: 'Docs' },
    { blog: true, label: 'Blog' },
    { href: 'https://github.com/reid47/testaway', label: 'GitHub' }
  ],

  headerIcon: 'img/testaway.svg',
  favicon: 'img/favicon.ico',

  colors: {
    primaryColor: '#1f7c98',
    secondaryColor: '#131823'
  },

  copyright: `Copyright © ${new Date().getFullYear()} Reid Mitchell`,

  highlight: {
    theme: 'atom-one-light'
  },

  scripts: ['https://buttons.github.io/buttons.js'],
  stylesheets: ['https://fonts.googleapis.com/css?family=Roboto:300,700'],

  onPageNav: 'separate',
  cleanUrl: true,

  enableUpdateBy: true,
  enableUpdateTime: true

  // algolia: {
  //   apiKey: 'my-api-key',
  //   indexName: 'my-index-name',
  //   algoliaOptions: {}
  // }
};

module.exports = siteConfig;
