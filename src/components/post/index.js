import React from "react";
import { Link } from 'gatsby';
// import { Picture } from "../picture";
import Img from 'gatsby-image';
import { Keyword } from "../keyword";
import moment from 'moment';
import 'moment/locale/zh-cn';

export function Post({ node, top, simple }) {
    const tm = moment(node.frontmatter.date).locale('zh-cn')
    const now = moment(new Date())
    let older = now.valueOf() - (86400 * 7 * 1000) > tm.valueOf()
    if (top) {
        return (
            <Link to={node.fields.slug} class="box border is-radiusless is-shadowless">
                <div className="header">
                    <h1 className="title is-4 mb-2 has-text-centered ">
                        {node.frontmatter.title}
                    </h1>
                    <p className="has-text-grey has-text-centered is-size-7">{older ? tm.format('YYYY/MM/DD') : tm.fromNow()}</p>
                </div>
                {
                    node.frontmatter.image &&
                    <figure className="my-2 image">
                        <Img fluid={node.frontmatter.image.childImageSharp.fluid}></Img>
                    </figure>
                }
                <p className={"mt-2"}>{node.excerpt}</p>
                {
                    node.frontmatter.keywords.map(k => <Keyword className={'mt-4 mr-2'} name={k} />)
                }
            </Link>
        )
    } else {
        return (
            <div className="columns bottom-line">
                <div className={'column ' + (node.frontmatter.image ? 'is-three-quarters' : '')}>
                    <Link to={node.fields.slug} className="title is-5 mt-2 mr-2">{node.frontmatter.title}</Link>
                    {
                        !simple &&
                        <div className="my-2 has-text-grey-darker">
                            {node.frontmatter.description ? node.frontmatter.description : node.excerpt}
                        </div>
                    }
                    {
                        node.frontmatter.keywords.map(k => <Keyword className={'mr-1'} name={k} />)
                    }
                    <span className="has-text-grey-light is-size-7">{older ? tm.format('YYYY/MM/DD') : tm.fromNow()}</span>
                </div>
                {
                    !simple && node.frontmatter.image &&
                    <div className="column">
                        <figure className="image">
                            <Img fluid={node.frontmatter.image.childImageSharp.fluid}></Img>
                            {/* <img src={node.frontmatter.image.publicURL} alt={node.frontmatter.title} /> */}
                        </figure>
                    </div>
                }
            </div>
        )
    }
}




