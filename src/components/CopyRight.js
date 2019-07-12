import React, { Component } from 'react'
import { Link } from '@reach/router';

export default class CopyRight extends Component {
    render() {
        const { title, slug, url, author } = this.props;
        return (
            <blockquote>
                <ul>
                    <li>
                        <strong>文章链接</strong>
                        &nbsp;&nbsp;:&nbsp;&nbsp;
                        <Link to={slug} key={title}>
                            {url}
                        </Link>
                    </li>
                    <li>
                        <strong>版权声明</strong>
                        &nbsp;&nbsp;:&nbsp;&nbsp;自由转载-非商用-非衍生-保持署名 <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank">创意共享3.0许可证</a>
                    </li>
                </ul>
            </blockquote>
        )
    }
}
