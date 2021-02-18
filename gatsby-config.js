module.exports = {
  pathPrefix: '/star-tracker',
  siteMetadata: {
    title: `👋 Hi guys. Thanks to visit GitHub star tracker.`,
    githubUrl: 'https://github.com/visiky/star-tracker/',
    author: 'visiky',
    contact: 'https://github.com/visiky',
    wechat: 'https://gw.alipayobjects.com/zos/antfincdn/4NqKnYGSyO/wechart.JPG',
  },
  flags: {
    DEV_SSR: true,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-antd',
      options: {
        style: true,
      },
    },
    {
      resolve: 'gatsby-plugin-less',
      options: {
        strictMath: true,
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            'primary-color': '#873bf4',
            'font-family': 'Arial',
          },
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
