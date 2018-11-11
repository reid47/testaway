const siteConfig = {
  title: 'Testaway',
  tagline: 'A JavaScript testing library',
  url: 'https://testaway.io',
  baseUrl: '/',

  repoUrl: 'https://github.com/reid47/testaway',
  projectName: 'testaway',
  organizationName: 'reid47',

  headerLinks: [
    { doc: 'doc1', label: 'Get Started' },
    { doc: 'doc1', label: 'Guides' },
    { doc: 'doc4', label: 'API' },
    { blog: true, label: 'Blog' }
  ],

  headerIcon: 'img/testaway.svg',
  favicon: 'img/favicon.png',

  colors: {
    primaryColor: '#2288a7',
    secondaryColor: '#131823'
  },

  copyright: `Copyright © ${new Date().getFullYear()} Reid Mitchell`,

  highlight: {
    theme: 'default'
  },

  scripts: ['https://buttons.github.io/buttons.js'],
  stylesheets: ['https://fonts.googleapis.com/css?family=Roboto:300,700'],

  onPageNav: 'separate',
  cleanUrl: true,

  enableUpdateBy: true,
  enableUpdateTime: true
};

module.exports = siteConfig;
