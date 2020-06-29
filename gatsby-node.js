const fs = require("fs")
const path = require('path')
const kebabCase = require('lodash.kebabcase')
const { createFilePath } = require(`gatsby-source-filesystem`)
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions
    if (node.internal.type === `MarkdownRemark`) {
        fmImagesToRelative(node)
        const slug = createFilePath({ node, getNode, basePath: `content` })
        createNodeField({
            node,
            name: `slug`,
            value: slug,
        })

    }
}


// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
    const { createPage } = actions

    // Only update the `/q` page.
    if (page.path.match(/^\/q/)) {
        // page.matchPath is a special key that's used for matching pages
        // with corresponding routes only on the client.
        page.matchPath = "/q/*"

        // Update the page.
        createPage(page)
    }
}

exports.createPages = async ({ graphql, actions, reporter }) => {
    const { createPage, createNode } = actions
    const articlesPage = path.resolve('src/templates/articles.js')
    const postPage = path.resolve('src/templates/post.js')
    const authorPage = path.resolve('src/templates/author.js')
    const keywordPage = path.resolve('src/templates/keyword.js')
    const topicPage = path.resolve('src/templates/topic.js')
    const docPage = path.resolve('src/templates/doc.js')

    const gqldocs = await graphql(`    
    {
        allMarkdownRemark(filter: { fields: { slug: { regex: "/^\/doc\//" } } }, sort: { fields: frontmatter___date, order: DESC }, limit: 1000) {
            edges {
                node {
                    fields {
                        slug
                    }
                    frontmatter {
                        title
                        description
                        keywords
                        date
                        author
                        topics
                    }
                    html
                }
            }
        }
    }
    `)
    if (gqldocs.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query for docs.`)
        return
    }

    const docs = new Array()
    gqldocs.data.allMarkdownRemark.edges.forEach(edge => {
        docs.push(edge.node)
    })
    //create topic page
    docs.forEach((doc, index) => {
        createPage({
            path: doc.fields.slug,
            component: docPage,
            context: {
                node: doc,
                previous: index === 0 ? null : docs[index - 1],
                next: index === (docs.length - 1) ? null : docs[index + 1],
            },
        })
    })

    const gqltopics = await graphql(`
    {
        allMarkdownRemark(filter: { fields: { slug: { regex: "/^\/topic\//" } } }, sort: { fields: frontmatter___sort, order: DESC }) {
            edges {
                node {
                    fields {
                        slug
                    }
                    frontmatter {
                        code
                        title
                        image {
                            childImageSharp {
                                fluid {
                                    aspectRatio
                                    base64
                                    sizes
                                    src
                                    srcSet
                                }
                            }
                            publicURL
                        }
                        keywords
                        sort
                    }
                }
            }
        }
    }
    `)

    if (gqltopics.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query for topics.`)
        return
    }

    const topics = new Array()
    gqltopics.data.allMarkdownRemark.edges.forEach(edge => {
        topics.push(edge.node)
    })
    //create topic page
    topics.forEach((topic, index) => {
        createPage({
            path: topic.fields.slug,
            component: topicPage,
            context: {
                code: topic.frontmatter.code,
                node: topic,
                previous: index === 0 ? null : topics[index - 1],
                next: index === (topics.length - 1) ? null : topics[index + 1],
            },
        })
    })

    const gqlauthors = await graphql(`
    {
        allMarkdownRemark(filter: {fields: {slug: {regex: "/^\/author\//"}}}) {
            edges {
            node {
                fields {
                slug
                }
                frontmatter {
                email
                code
                name
                image {
                    childImageSharp {
                        fluid {
                            aspectRatio
                            base64
                            sizes
                            src
                            srcSet
                        }
                    }
                    publicURL
                }
                }
                html
                internal {
                contentDigest
                }
            }
            }
        }
    }
    `)

    if (gqlauthors.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query for authors.`)
        return
    }

    const authors = new Array()
    gqlauthors.data.allMarkdownRemark.edges.forEach(edge => {
        authors.push(edge.node)
    })
    //create author page
    authors.forEach((author, index) => {
        createPage({
            path: author.fields.slug,
            component: authorPage,
            context: {
                code: author.frontmatter.code,
                node: author,
                previous: index === 0 ? null : authors[index - 1],
                next: index === (authors.length - 1) ? null : authors[index + 1],
            },
        })
    })

    const result = await graphql(
        `
        {
            allMarkdownRemark(filter: {fields: {slug: {regex: "/^\/post\//"}}}, sort: {fields: frontmatter___date, order: DESC}) {
                edges {
                node {
                    fields {
                    slug
                    }
                    frontmatter {
                    keywords
                    topics
                    author
                    date
                    description
                    email
                    name
                    share
                    title
                    image {
                        childImageSharp {
                        fluid {
                            aspectRatio
                            base64
                            sizes
                            src
                            srcSet
                            tracedSVG
                        }
                        }
                        publicURL
                    }
                    }
                    html
                    internal {
                    contentDigest
                    }
                    timeToRead
                    tableOfContents
                    excerpt(pruneLength: 200)
                }
                }
            }
        }
    `
    )

    if (result.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query for posts.`)
        return
    }

    const keywords = new Set()
    const posts = new Array()

    result.data.allMarkdownRemark.edges.forEach(edge => {
        //keywords
        if (edge.node.frontmatter.keywords) {
            edge.node.frontmatter.keywords.forEach(keyword => {
                keywords.add(keyword)
            })
        }

        //create /post/ page
        posts.push(edge.node)
    })

    //create post page
    posts.forEach((post, index) => {
        createPage({
            path: post.fields.slug,
            component: postPage,
            context: {
                node: post,
                previous: index === 0 ? null : posts[index - 1],
                next: index === (posts.length - 1) ? null : posts[index + 1],
            },
        })
    })


    //create keyword page
    const keywordList = Array.from(keywords)
    keywordList.forEach(keyword => {
        createPage({
            path: `/keyword/${kebabCase(keyword)}/`,
            component: keywordPage,
            context: {
                keyword,
            },
        })
    })

    //create post/paging page
    const postsPerPage = 10;
    const pageCount = Math.ceil(posts.length / postsPerPage);

    [...Array(pageCount)].forEach((_val, pageNum) => {
        createPage({
            path: pageNum === 0 ? `/articles` : `/articles/${pageNum}/`,
            component: articlesPage,
            context: {
                limit: postsPerPage,
                skip: pageNum * postsPerPage,
                pageCount,
                currentPageNum: pageNum,
                totalCount: posts.length,
            }
        });
    });
}
