import React from "react";
import { Link } from 'gatsby';
import { useAuthorMap } from "../../hooks";

export function Author({ node, className }) {

    return (
        <>
            {
                node &&
                <Link to={node.fields.slug} className={'button is-white topic ' + className}>
                    <figure className="image is-24x24">
                        <img className={'is-rounded'} src={node.frontmatter.image.publicURL} alt={node.frontmatter.title} />
                    </figure>
                    <h1 className="ml-1 title is-7">{node.frontmatter.name}</h1>
                </Link>
            }
        </>
    )
}

export function AuthorByCode({ code, className }) {
    const ts = useAuthorMap()
    let t = ts['/author/' + code + "/"]
    return (
        <Author node={t} className={className} />
    )
}