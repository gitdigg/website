import React from "react";
import { Helmet } from "react-helmet";
import { Layout, SEO, Search, SideBar, Post, Pagination } from "../components";
import { useConfigs, useTopics } from "../hooks";
import { graphql } from 'gatsby';

export default function HomePage({ data }) {
  const { title, keywords } = useConfigs()
  const topics = useTopics()
  topics.forEach(element => {
    keywords.push(element.frontmatter.title)
  });

  return (
    <Layout>
      <Helmet title={title} />
      <SEO keywords={keywords} />
      <div className="container main">
        <div className="columns mt-4">
          <div className="column is-three-quarters">
            {
              data.allMarkdownRemark.edges.map((element, index) => {
                return (<Post key={index} node={element.node} top={index === 0} />)
              })
            }
            <Pagination total={data.allMarkdownRemark.totalCount} pageSize={10} currentPage={0}></Pagination>
          </div>
          <div className="column">
            <div className="box border is-radiusless is-shadowless">
              <Search />
            </div>
            <SideBar />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
query HomePageQuery {
  allMarkdownRemark(filter: { fields: { slug: { regex: "/^\/post\//" } } }, sort: { order: DESC, fields: frontmatter___date }, limit: 10) {
    totalCount
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
      }
    }
  }
}
`
