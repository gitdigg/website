import { useStaticQuery, graphql } from "gatsby"

export const useAuthorMap = () => {
    const { allMarkdownRemark } = useStaticQuery(graphql`
        query {
            allMarkdownRemark(filter: {fields: {slug: {regex: "/^\/author\//"}}}, sort: {fields: frontmatter___sort, order: DESC}) {
                edges {
                    node {
                        fields {
                            slug
                        }
                        frontmatter {
                            name
                            email
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
                    }
                }
            }
        }
    `
    )
    let authors = {}
    if (allMarkdownRemark.edges.length > 0) {
        allMarkdownRemark.edges.forEach(element => {
            authors[element.node.fields.slug] = element.node
        });
    }
    return authors
}
