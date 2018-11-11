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

  /* path to images for header/footer */
  headerIcon: 'img/docusaurus.svg',
  footerIcon: 'img/docusaurus.svg',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#353f5a',
    secondaryColor: '#131823'
  },

  copyright: `Copyright © ${new Date().getFullYear()} Reid Mitchell`,

  highlight: {
    theme: 'default'
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',

  enableUpdateBy: true,
  enableUpdateTime: true
};

module.exports = siteConfig;
