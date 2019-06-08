import React, { Component } from 'react'

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer container">
        <a href="/categories/" rel="noopener noreferrer">
          Categories
        </a>
        <a href="/tags/" rel="noopener noreferrer">
          Tags
        </a>        
        <a href="https://twitter.com/gitdigg" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
        <a href="https://github.com/liujianping" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a
          href="https://github.com/gitdigg/website"
          target="_blank"
          rel="noopener noreferrer"
        >
          View source
        </a>
        
      </footer>
    )
  }
}
