import { useStaticQuery, graphql } from "gatsby"

export const usePosts = () => {
    const { allMarkdownRemark } = useStaticQuery(graphql`
        {
            allMarkdownRemark(filter: { fields: { slug: { regex: "/^\/post\//" } } }, sort: { fields: frontmatter___date, order: DESC }, limit: 1000) {
                edges {
                    node {
                        fields {
                        slug
                        }
                        frontmatter {
                        title
                        date
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
                        description
                        keywords
                        sort
                        }
                        excerpt
                        rawMarkdownBody
                    }
                }
            }
        }
    `
    )
    return allMarkdownRemark.edges
}
