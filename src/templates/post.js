import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import Layout from '../layout'
import UserInfo from '../components/UserInfo'
import PostTags from '../components/PostTags'
import SEO from '../components/SEO'
import config from '../../data/SiteConfig'
import { formatDate, editOnGithub } from '../utils/global'
import { DiscussionEmbed } from "disqus-react";

export default class PostTemplate extends Component {
  render() {
    const { slug } = this.props.pageContext
    const postNode = this.props.data.markdownRemark
    const post = postNode.frontmatter
    const disqusShortname = "gitdigg";
    const disqusConfig = {
      identifier: slug,
      title: post.title,
    };
    let thumbnail

    if (!post.id) {
      post.id = slug
    }
    if (!post.category_id) {
      post.category_id = config.postDefaultCategoryID
    }

    if (post.thumbnail) {
      thumbnail = post.thumbnail.childImageSharp.fixed
    }

    const date = formatDate(post.date)
    const githubLink = editOnGithub(post)
    const twitterUrl = `https://twitter.com/search?q=${config.siteUrl}/${post.slug}/`
    const twitterShare = `http://twitter.com/share?text=${encodeURIComponent(post.title)}&url=${
      config.siteUrl
    }/${post.slug}/&via=gitdigg`
    return (
      <Layout>
        <Helmet>
          <title>{`${post.title} – ${config.siteTitle}`}</title>
        </Helmet>
        <SEO postPath={slug} postNode={postNode} postSEO />
        <article className="single container">
          <header className={`single-header ${!thumbnail ? 'no-thumbnail' : ''}`}>
            {thumbnail ? <Img fixed={post.thumbnail.childImageSharp.fixed} /> : null}
            <div className="flex">
              <h1>{post.title}</h1>
              <div className="post-meta">
                <time className="date">{date}</time>
/
                <a className="twitter-link" href={twitterShare}>
                  分享
                </a>
                /
                <a className="github-link" href={githubLink} target="_blank">
                  编辑 ✏️
                </a>
              </div>
              <PostTags tags={post.tags} />
            </div>
          </header>
          <div className="post" dangerouslySetInnerHTML={{ __html: postNode.html }} />
          <div>
            {' '}
            <a className="button twitter-button" href={twitterShare} target="_blank">
              Share on Twitter
            </a>
            {' '}
            <a className="button twitter-button" href={twitterUrl} target="_blank">
              Discuss on Twitter
            </a>
          </div>
        </article>
        <UserInfo name={post.author} />
        <div className="container">
        <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
        </div>
      </Layout>
    )
  }
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        thumbnail {
          childImageSharp {
            fixed(width: 150, height: 150) {
              ...GatsbyImageSharpFixed
            }
          }
        }
        slug
        date
        author
        categories
        tags
        template
      }
      fields {
        nextTitle
        nextSlug
        prevTitle
        prevSlug
        slug
        date
      }
    }
  }
`
