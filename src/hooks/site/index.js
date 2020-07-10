import { useStaticQuery, graphql } from "gatsby"

export const useConfigs = () => {
  const { site } = useStaticQuery(graphql`
      query {
        site {
          siteMetadata {
            description
            title
            titleAlt
            keywords
            url
            siteUrl
            twitter
            image 
            prefix
            creator {
              email
              location
              name
            }
            gitalk {
              clientID
              clientSecret
              accessToken
              repo
              owner
              admin
            }
          }
        }
      }
    `
  )
  return site.siteMetadata
}
