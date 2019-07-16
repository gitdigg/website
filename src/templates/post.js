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
import Gitalk from 'gitalk'
import 'gitalk/dist/gitalk.css'
import CopyRight from '../components/CopyRight';

export default class PostTemplate extends Component {
  componentDidMount() {
    const { slug } = this.props.pageContext
    var gitalk = new Gitalk({
      clientID: '381ef6e29bdffb9ad797',
      clientSecret: '558305235c247d8766aa9d051cfce259818c0b85',
      repo: 'website',
      owner: 'gitdigg',
      admin: ['liujianping'],
      id: slug,      // Ensure uniqueness and length less than 50
      distractionFreeMode: false  // Facebook-like distraction free mode
    })
    gitalk.render('gitalk-container')
  }

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
    const url = `${config.siteUrl}/${post.slug}`
    const date = formatDate(post.date)
    const githubLink = editOnGithub(post)
    const twitterUrl = `https://twitter.com/search?q=${config.siteUrl}/${post.slug}/`
    const twitterShare = `http://twitter.com/share?text=${encodeURIComponent(post.title)}&url=${
      config.siteUrl
      }/${post.slug}/&via=gitdigg`

    return (
      <Layout>
        <Helmet>
          {post.tags &&
            post.tags.map(tag => (
              <meta property="article:tag" content={tag} />
            ))}
          <title>{`${post.title} – ${config.siteTitle}`}</title>

          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css"></link>
          <script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>
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
                <a className="twitter-link" href="https://github.com/liujianping">
                  {post.author}
                </a>
                /
                <a className="twitter-link" href={twitterShare}>
                  分享
                </a>
                /
                <a className="github-link" href={githubLink} target="_blank">
                  编辑 ✏️
                </a>
              </div>
            </div>
          </header>
          <div className="post" dangerouslySetInnerHTML={{ __html: postNode.html }} />
          <CopyRight author={post.author} slug={slug} url={url} title={post.title} />
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
          <div id="gitalk-container"></div>
          {/* <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} /> */}
        </div>
      </Layout>
    )
  }
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
            markdownRemark(fields: {slug: {eq: $slug } }) {
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
