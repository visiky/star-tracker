module.exports = {
  pathPrefix: "/star-tracker",
  siteMetadata: {
    title: `Hi guys 👋 , GitHub stars. Built with @antv/g2plot`,
    githubUrl: 'https://github.com/visiky/star-tracker/',
    author: `visiky`,
  },
  flags: {
    DEV_SSR: true
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-less',
      options: {
        strictMath: true,
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
