import React from "react";
import { Link } from 'gatsby';

export function Pagination({ total, pageSize, currentPage }) {
    const pageCount = Math.ceil(total / pageSize);
    let pages = [];
    [...Array(pageCount)].forEach((_val, pageNum) => {
        let path = (pageNum === 0 ? `/articles` : `/articles/${pageNum}/`)
        pages.push(path)
    });
    return (
        <nav className="pagination" role="navigation" aria-label="pagination">
            <Link className="pagination-previous" to={currentPage <= 1 ? '/articles/' : `/articles/${currentPage - 1}/`} title="首页">上一页</Link>
            <Link className="pagination-next" to={currentPage + 1 >= pageCount ? `/articles/${pageCount - 1}/` : `/articles/${currentPage + 1}/`}>下一页</Link>
            <ul className="pagination-list">
                {
                    pages.map((path, index) => {
                        return (
                            <li key={index}>
                                <Link key={index} className={'pagination-link ' + (currentPage === index ? 'is-current' : '')} to={path}>{index + 1}</Link>
                            </li>
                        )
                    })
                }
            </ul>
        </nav >
    )
}


