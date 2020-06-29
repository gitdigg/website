import React from "react";
import { Link } from 'gatsby';

export function Footer({ className }) {
    return (
        <footer className="section mt-4 has-background-light">
            <nav className="breadcrumb is-small is-centered has-dot-separator" aria-label="breadcrumbs">
                <ul>
                    <li><Link to="/doc/announce">公告</Link></li>
                    <li><Link to="/doc/copyright">版权</Link></li>
                    {/* <li><Link to="/keywords">关键字</Link></li> */}
                    <li><a aria-label={'opensource'} target="_blank" rel="nofollow noopener noreferrer" href="https://github.com/gitdigg/website">开源</a></li>
                    <li><Link to="/about">关于</Link></li>
                </ul>
                <p className="has-text-centered has-text-grey-dark"> copyright @ 2020 powered by <a target="_blank" rel="noreferrer" href={'https://netlify.com/'}>netlify</a></p>
            </nav>
        </footer>
    )
}