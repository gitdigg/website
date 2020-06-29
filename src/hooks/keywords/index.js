import { useStaticQuery, graphql } from "gatsby"

export const useKeywords = () => {
    const { allMarkdownRemark } = useStaticQuery(graphql`
        {
            allMarkdownRemark(filter: {fields: {slug: {regex: "/^\/post\//"}}}) {
                group(field: frontmatter___keywords) {
                fieldValue
                totalCount
                }
            }
        }
    `
    )
    return allMarkdownRemark.group
}

