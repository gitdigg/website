import React from 'react';
import { Link } from 'gatsby';

export function CopyRight({ share }) {
    return (
        <Link to='/doc/copyright' className="tag is-light is-info small">
            <span className="icon">
                <i className="gitdig-copyright"></i>
            </span>
            <span className="is-size-7">{share ? '知识共享许可协议 4.0' : '未经许可，不得转载'}</span>
        </Link>
    )
}
