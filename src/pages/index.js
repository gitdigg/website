import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Layout from '../layout'
import PostListing from '../components/PostListing'
import ProjectListing from '../components/ProjectListing'
import TopicListing from '../components/TopicListing'
import SEO from '../components/SEO'
import UserInfo from '../components/UserInfo'
import config from '../../data/SiteConfig'
import projects from '../../data/projects'
import topics from '../../data/topics'
import quotations from '../../data/quotations'

export default class Index extends Component {
  render() {
    const { data } = this.props

    let r = Math.random() * 100 + 1;
    r = Math.floor(r % quotations.length);

    const quotate = quotations[r]
    const latestPostEdges = data.latest.edges
    const popularPostEdges = data.popular.edges

    return (
      <Layout>
        <Helmet title={`${config.siteTitle} – ${config.siteTitleShort}`} />
        <SEO />
        <div className="container">
          <div className="quotations">
            <blockquote className="quotation">
              <p>
                {quotate.content}
              </p>
              <cite>— {quotate.author} {quotate.date}</cite>
            </blockquote>
          </div>
        </div>
        <div className="container front-page">
          <section className="section">
            <h2 className="callouts">主题小册</h2>
            <TopicListing topics={topics} max={2} more={true} />
          </section>
        </div>
        <div className="container front-page">
          <section className="section">
            <h2>最新文章</h2>
            <PostListing simple postEdges={latestPostEdges} />
          </section>

          <section className="section">
            <h2>热门文章</h2>
            <PostListing simple postEdges={popularPostEdges} />
          </section>

          <section className="section">
            <h2>开源项目</h2>
            <ProjectListing projects={projects} />
          </section>
        </div>
        <UserInfo name={config.userName} />
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query IndexQuery {
    latest: allMarkdownRemark(
      limit: 6
      sort: { fields: [fields___date], order: DESC }
      filter: { frontmatter: { template: { eq: "post" }, published: {
          in: [null, true]
        } } }
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            categories
            thumbnail {
              childImageSharp {
                fixed(width: 150, height: 150) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            date
            template
          }
        }
      }
    }
    popular: allMarkdownRemark(
      limit: 6
      sort: { fields: [fields___date], order: DESC }
      filter: { frontmatter: { categories: { eq: "Popular" } published: {
          in: [null, true]
        } } }
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            categories
            thumbnail {
              childImageSharp {
                fixed(width: 150, height: 150) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            date
            template
          }
        }
      }
    }
  }
`
