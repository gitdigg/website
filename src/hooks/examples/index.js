import { useStaticQuery, graphql } from "gatsby"

export const useExamples = () => {
    const { allMarkdownRemark } = useStaticQuery(graphql`
        query MyQuery {
            allMarkdownRemark(filter: {fields: {slug: {regex: "/^\/example\//"}}}, sort: {fields: frontmatter___sort, order: DESC}) {
                edges {
                node {
                    frontmatter {
                    link
                    keywords
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
                    code
                    repo
                    sort
                    }
                }
                }
            }
            }
    `
    )
    let examples = []
    if (allMarkdownRemark.edges.length > 0) {
        allMarkdownRemark.edges.forEach(element => {
            examples.push(element.node)
        });
    }
    return examples
}

