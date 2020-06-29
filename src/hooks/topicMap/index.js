import { useStaticQuery, graphql } from "gatsby"

export const useTopicMap = () => {
    const { allMarkdownRemark } = useStaticQuery(graphql`
        query {
            allMarkdownRemark(filter: {fields: {slug: {regex: "/^\/topic\//"}}}, sort: {fields: frontmatter___sort, order: DESC}) {
                edges {
                    node {
                        fields {
                            slug
                        }
                        frontmatter {
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
    `
    )
    let topicMap = {}
    if (allMarkdownRemark.edges.length > 0) {
        allMarkdownRemark.edges.forEach(element => {
            topicMap[element.node.fields.slug] = element.node
        });
    }
    return topicMap
}
