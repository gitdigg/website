import React, { Component } from 'react'

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer container">
        <a href="/categories/" rel="noopener noreferrer">
          分类
        </a>
        <a href="/tags/" rel="noopener noreferrer">
          标签
        </a>
        <a href="https://gitdig.com/rss.xml" rel="noopener noreferrer">
          RSS
        </a>
        <a href="https://twitter.com/gitdigg" target="_blank" rel="noopener noreferrer">
          社交
        </a>
        <a href="https://github.com/liujianping" target="_blank" rel="noopener noreferrer">
          开源
        </a>
        <a
          href="https://github.com/gitdigg/website"
          target="_blank"
          rel="noopener noreferrer"
        >
          代码
        </a>

      </footer>
    )
  }
}
