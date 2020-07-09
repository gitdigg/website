import React from "react";
import { Link } from 'gatsby';
import { useTopicMap } from "../../hooks";

export function Topic({ node, className }) {
    return (
        <>
            {
                node &&
                <Link to={node.fields.slug} className={'button is-white topic ' + className}>
                    <figure className="image is-24x24">
                        <img className={"is-rounded"} src={node.frontmatter.image.publicURL} alt={node.frontmatter.title} />
                    </figure>
                    <h1 className="ml-1 title is-7">{node.frontmatter.title}</h1>
                </Link>
            }
        </>
    )
}

export function TopicByCode({ code, className }) {
    const ts = useTopicMap()
    let t = ts['/topic/' + code + "/"]
    return (
        <Topic node={t} className={className} />
    )
}