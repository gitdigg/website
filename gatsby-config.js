/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
const urljoin = require('url-join')

module.exports = {
  siteMetadata: {
    title: "寄居蟹 - GitDiG.com",
    titleAlt: "寄居蟹",
    description: "一只寄居蟹留下的足迹 - Tracing My Memories",
    keywords: [
      "程序员",
      "自媒体"
    ],
    image: "/logo.png",
    url: "https://www.gitdig.com",
    siteUrl: "https://www.gitdig.com",
    prefix: "",
    twitter: "gitdigg",
    dateFromFormat: "YYYY/MM/DD",
    author: "JayL",
    creator: {
      email: "gitdig.com@gmail.com",
      location: "Shanghai, China",
      name: "JayL",
    },
    gitalk: {
      clientID: '381ef6e29bdffb9ad797',
      clientSecret: '558305235c247d8766aa9d051cfce259818c0b85',
      accessToken: '1aa68eb64339e91f00e9e29ace0314e8c5bc3092',
      repo: 'website',
      owner: 'gitdigg',
      admin: ['liujianping'],
    },
    rssMetadata: {
      site_url: "https://www.gitdig.com",
      feed_url: "https://www.gitdig.com/rss.xml",
      title: "寄居蟹 - GitDiG.com",
      description: "一只寄居蟹留下的足迹 - Tracing My Memories",
      image_url: "https://www.gitdig.com/logo.png",
    },
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          '/*.js': ['cache-control: public, max-age=31536000, immutable'],
          '/*.css': ['cache-control: public, max-age=31536000, immutable'],
          '/sw.js': ['cache-control: public, max-age=0, must-revalidate'],
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-141133293-1",
        head: true,
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-embed-video`,
          `gatsby-remark-responsive-iframe`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              offsetY: 60,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              showLineNumbers: true,
            },
          }
        ],
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  // description: edge.node.excerpt,
                  title: edge.node.frontmatter.title,
                  date: edge.node.frontmatter.date,
                  url: urljoin(site.siteMetadata.siteUrl, edge.node.fields.slug),
                  guid: edge.node.internal.contentDigest,
                })
              })
            },
            query: `
              {
                allMarkdownRemark(limit: 1000, filter: {fields: {slug: {regex: "/^\/post\//"}}}, sort: {fields: frontmatter___date, order: DESC}) {
                  edges {
                    node {
                      excerpt(pruneLength: 180)
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                        topics
                        keywords
                        description
                      }
                      internal {
                        contentDigest
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "GitDiG.com RSS Feed",
          },
        ],
      },
    },
  ],
}
