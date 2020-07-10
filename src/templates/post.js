import React from "react";
import urljoin from "url-join";
import { Helmet } from "react-helmet";
import { Link } from 'gatsby';
import { TwitterShareButton, TwitterIcon, WeiboShareButton, WeiboIcon, FacebookShareButton, FacebookIcon } from 'react-share';
import { Layout, SEO, Search, TopicByCode, AuthorByCode, CopyRight, Counter, Thumbup, Comment, SquareAds, ContentAds } from "../components";
import { useConfigs } from "../hooks";
import 'gitalk/dist/gitalk.css';
import loadable from '@loadable/component'
// import GitalkComponent from "gitalk/dist/gitalk-component";
// fixed yarn build error: Window is not defined at production build 
const GitalkComponent = loadable(() => import("gitalk/dist/gitalk-component"))

export default function PostPage({ pageContext }) {
    const { next, previous, node } = pageContext
    const config = useConfigs()
    const curl = urljoin(config.url, config.prefix, node.fields.slug)
    return (
        <Layout>
            <Helmet>
                <title>{`${node.frontmatter.title} | ${config.title}`}</title>
                {
                    previous &&
                    <link rel="prev" title={previous.frontmatter.title} href={urljoin(config.url, config.prefix, previous.fields.slug)} />
                }
                {
                    next &&
                    <link rel="next" title={next.frontmatter.title} href={urljoin(config.url, config.prefix, next.fields.slug)} />
                }
            </Helmet>
            <SEO keywords={node.frontmatter.keywords} postNode={node} postPath={node.fields.slug} postSEO />
            <div className="container main">
                <div className="columns mt-4">
                    <div className="column is-three-quarters">
                        <div className="box border is-radiusless is-shadowless">
                            <div className="header">
                                <nav className="level">
                                    <div className="level-left">
                                        <div className="level-item">
                                            <span className="tag is-white">
                                                <AuthorByCode code={node.frontmatter.author}></AuthorByCode>
                                            </span>
                                            {
                                                node.frontmatter.topics.map((t, idx) => <span className="tag is-white" key={idx}><TopicByCode key={idx} code={t} /></span>)
                                            }
                                        </div>
                                    </div>
                                    <div className="level-right">
                                        <div className="level-item">
                                            <TwitterShareButton className={'mx-1'} url={curl}>
                                                <TwitterIcon size={24} round={true}></TwitterIcon>
                                            </TwitterShareButton>
                                            <FacebookShareButton className={'mx-1'} url={curl}>
                                                <FacebookIcon size={24} round={true}></FacebookIcon>
                                            </FacebookShareButton>
                                            <WeiboShareButton className={'mx-1'} url={curl}>
                                                <WeiboIcon size={24} round={true}></WeiboIcon>
                                            </WeiboShareButton>
                                        </div>
                                    </div>
                                </nav>
                                <h1 className="title is-4 mb-2 has-text-centered ">
                                    {node.frontmatter.title}
                                </h1>
                            </div>
                            <div className="article">
                                {
                                    node.frontmatter.description &&
                                    <div className="mt-2 quote content">
                                        <blockquote>{node.frontmatter.description}</blockquote>
                                    </div>
                                }
                                <div className="content" dangerouslySetInnerHTML={{ __html: node.html }} />
                                <ContentAds/>
                                <div className="flex-space-between">
                                    <div><Counter  url={urljoin(config.siteUrl, node.fields.slug)} session className='is-light is-info' initSsns={node.frontmatter.reads}/></div>
                                    <div><CopyRight share={node.frontmatter.share}></CopyRight></div>
                                </div>                                
                            </div>
                        </div>
                        <nav className="box border is-radiusless is-shadowless level">
                            {
                                previous &&
                                <Link className="level-left has-text-centered" to={previous.fields.slug}>上一篇</Link>
                            }
                            {
                                next &&
                                <Link className="level-right has-text-centered" to={next.fields.slug}>下一篇</Link>
                            }
                        </nav>

                        <div id="gitalk" className='box border is-radiusless is-shadowless'>
                            <GitalkComponent options={{
                                clientID: config.gitalk.clientID,
                                clientSecret: config.gitalk.clientSecret,
                                accessToken: config.gitalk.accessToken,
                                repo: config.gitalk.repo,
                                owner: config.gitalk.owner,
                                admin: config.gitalk.admin,
                                id: node.internal.contentDigest,      // Ensure uniqueness and length less than 50
                                distractionFreeMode: false  // Facebook-like distraction free mode                    
                            }} />
                        </div>
                    </div>
                    <div className="column">
                        <div className="box border is-radiusless is-shadowless">
                            <Search />                                                    
                        </div>
                        <div className="stickyRight">                                                                                                      
                        {
                            node.tableOfContents.length > 0 &&                            
                                <div className="box border is-radiusless is-shadowless is-hidden-mobile toc" dangerouslySetInnerHTML={{ __html: node.tableOfContents }} />                                                       
                        }
                        <SquareAds/>
                        <div className="my-4">
                                <Thumbup  url={urljoin(config.siteUrl, node.fields.slug)} initThumbs={node.frontmatter.thumbs}/> 
                                <Comment/>                                
                        </div>    
                        </div> 
                    </div>
                </div>
            </div>
        </Layout >
    )
}
