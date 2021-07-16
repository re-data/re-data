const lightCodeTheme = require('prism-react-renderer/themes/vsDark');
const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 're_data docs',
  tagline: 'Learn more',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 're-data', // Usually your GitHub org/user name.
  projectName: 're-data', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 're_data',
      logo: {
        alt: 're_data logo',
        src: 'img/logo_circle.svg',
      },
      items: [
        {
          to: '/docs/introduction/whatis',
          label: 'Docs',
          position: 'left',
          activeBasePath: 'introduction'
        },
        {
          to: 'docs/getting_started/installation/for_dbt_users',
          label: 'Getting started',
          position: 'left',
          activeBasePath: 'reference'
        },
        {
          to: 'docs/reference/config',
          label: 'Reference',
          position: 'left',
          activeBasePath: 'reference'
        },
        {
          href: 'https://github.com/re-data/re-data',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © 2021 ReData. All Rights Reserved.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
