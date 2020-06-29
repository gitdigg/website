import React from "react";
import { Helmet } from "react-helmet";
import { Layout, SEO, Search, SideBar, Post } from "../components";
import { useConfigs } from "../hooks";
import { Link, graphql } from 'gatsby';

export default function KeywordPage({ pageContext, data }) {
    const { keyword } = pageContext
    const config = useConfigs()
    let keywords = []
    keywords.push(keyword)
    return (
        <Layout>
            <Helmet title={`关键字 – ${keyword} | ${config.title}`} />
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
                <div className="columns mt-4">
                    <div className="column is-three-quarters">
                        <nav class="breadcrumb" aria-label="breadcrumbs">
                            <ul>
                                <li><Link to={'/'}>主页</Link></li>
                                <li><Link to={'/keywords/'}>关键字</Link></li>
                                <li class="is-active"><Link>{keyword}</Link></li>
                            </ul>
                        </nav>
                        {
                            data.allMarkdownRemark.edges.map((element, index) => {
                                return (<Post simple node={element.node}></Post>)
                            })
                        }
                        <p className="has-text-centered has-text-grey">已经到底了</p>
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
    query($keyword: String!) {
    allMarkdownRemark(filter: { fields: { slug: { regex: "/^\/post\//" } }, frontmatter: { keywords: { in: [$keyword] } } }, sort: { order: DESC, fields: frontmatter___date }) {
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
