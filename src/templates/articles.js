import React from "react";
import { Helmet } from "react-helmet";
import { Layout, SEO, Search, SideBar, Post, Pagination } from "../components";
import { useConfigs, useKeywords } from "../hooks";
import { graphql } from 'gatsby';

export default function ArticlesPage({ data, pageContext }) {
  const { currentPageNum, totalCount } = pageContext
  const { title } = useConfigs()

  const keywordCnts = useKeywords()
  let keywords = []
  keywordCnts.forEach(element => {
    keywords.push(element.fieldValue)
  });

  return (
    <Layout>
      <Helmet title={title} />
      <SEO keywords={keywords} />
      <section className="main hero is-light">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-mobile">
              <div className="column is-half is-offset-one-quarter">
                <Search />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        <div className="columns mt-4 mx-4">
          <div className="column is-three-quarters">
            {
              data.allMarkdownRemark.edges.map((element, index) => {
                return (<Post key={index} node={element.node}></Post>)
              })
            }
            <Pagination total={totalCount} pageSize={10} currentPage={currentPageNum}></Pagination>
          </div>
          <div className="column">
            <SideBar />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
query($limit: Int!, $skip: Int!) {
  allMarkdownRemark(filter: {fields: {slug: {regex: "/^\/post\//"}}}, sort: {order: DESC, fields: frontmatter___date}, limit: $limit, skip: $skip) {
    edges {
      node {
        fields {
          slug
        }
        frontmatter {
          title
          date
          thumbs
          reads
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
