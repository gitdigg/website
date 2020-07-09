import React from "react";
import urljoin from "url-join";
import { Helmet } from "react-helmet";
import { LayoutWithSideBar, SEO, Post } from "../components";
import { useConfigs } from "../hooks";
import { graphql } from 'gatsby';

export default function AuthorPage({ pageContext, data }) {
    const { next, previous, node } = pageContext
    const config = useConfigs()
    return (
        <LayoutWithSideBar>
            <Helmet>
                <title>{`作者 - ${node.frontmatter.name} | ${config.title}`}</title>
                {
                    previous &&
                    <link rel="prev" title={previous.frontmatter.name} href={urljoin(config.url, config.prefix, previous.fields.slug)} />
                }
                {
                    next &&
                    <link rel="next" title={next.frontmatter.name} href={urljoin(config.url, config.prefix, next.fields.slug)} />
                }
            </Helmet>
            <SEO keywords={node.frontmatter.keywords} />
            <div class="box border is-radiusless is-shadowless">
                <div className="header">
                    <h1 className="title is-4 mb-2 has-text-centered ">
                        {node.frontmatter.name}
                    </h1>
                </div>
                <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: node.html }}
                />
            </div>
            {
                data.allMarkdownRemark.edges.map((element, index) => {
                    return (<Post key={index} simple node={element.node}></Post>)
                })
            }
            <p className="has-text-centered has-text-grey">已经到底了</p>
        </LayoutWithSideBar>
    )
}

export const query = graphql`
    query($code: String!) {
    allMarkdownRemark(filter: { fields: { slug: { regex: "/^\/post\//" } }, frontmatter: { author: { eq: $code } } }, sort: { order: DESC, fields: frontmatter___date }) {
        edges {
            node {
                fields {
                    slug
                }
                frontmatter {
                    code
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
                    author
                    topics
                    keywords
                }
                excerpt
            }
        }
    }
}
`