import React from "react";
import urljoin from "url-join";
import { Helmet } from "react-helmet";
import { LayoutWithSideBar, SEO } from "../components";
import { useConfigs } from "../hooks";
import moment from 'moment';
import 'moment/locale/zh-cn';

export default function DocPage({ pageContext }) {
    const { next, previous, node } = pageContext
    const config = useConfigs()
    return (
        <LayoutWithSideBar>
            <Helmet>
                <title>{`${node.frontmatter.title} | ${config.title}`}</title>
                {
                    previous &&
                    <link rel="prev" title={previous.frontmatter.name} href={urljoin(config.url, config.prefix, previous.fields.slug)} />
                }
                {
                    next &&
                    <link rel="next" title={next.frontmatter.name} href={urljoin(config.url, config.prefix, next.fields.slug)} />
                }
            </Helmet>
            <SEO />
            <div class="box border is-radiusless is-shadowless">
                <div className="header">
                    <h1 className="title is-4 mb-2 has-text-centered ">
                        {node.frontmatter.title}
                    </h1>
                </div>
                <p className="has-text-centered">{
                    node.frontmatter.date &&
                    moment(node.frontmatter.date).locale('zh-cn').format('YYYY/MM/DD')
                }</p>
                <div className="article">
                    {
                        node.frontmatter.description &&
                        <div className="mt-2 quote content">
                            <blockquote>{node.frontmatter.description}</blockquote>
                        </div>
                    }
                    <div class="content" dangerouslySetInnerHTML={{ __html: node.html }} />
                </div>
            </div>
        </LayoutWithSideBar>
    )
}

