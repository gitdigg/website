import React from "react";
import { Link } from "gatsby";

export function Social({ className }) {
    return (
        <div className={'field has-addons ' + className}>
            <div className="control">
                <a aria-label={'github'} className="button is-dark" target="_blank" rel="nofollow noopener noreferrer" href="https://github.com/liujianping">
                    <span className="icon">
                        <i className="gitdig-github"></i>
                    </span>
                </a>
            </div>
            <div className="control">
                <a aria-label={'twitter'} className="button is-dark" target="_blank" rel="nofollow noopener noreferrer" href="https://twitter.com/gitdigg">
                    <span className="icon">
                        <i className="gitdig-twitter"></i>
                    </span>
                </a>
            </div>
            <div className="control">
                <a aria-label={'youtube'} className="button is-dark" target="_blank" rel="nofollow noopener noreferrer" href="https://www.youtube.com/channel/UCdF0fnZhnqDzhl0qbM4qv-A">
                    <span className="icon">
                        <i className="gitdig-youtube"></i>
                    </span>
                </a>
            </div>
            <div className="control">
                <Link aria-label={'rss'} className="button is-dark" target="_blank" to="/rss.xml">
                    <span className="icon">
                        <i className="gitdig-rss"></i>
                    </span>
                </Link>
            </div>
        </div>
    )
}