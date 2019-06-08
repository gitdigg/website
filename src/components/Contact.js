import React, { Component } from 'react'

export default class Contact extends Component {
  render() {
    return (
      <>
        <h1>保持联系</h1>
        <p>订阅最新的文章通知提醒.</p>
        <p>我的社交账号:</p>
        <ul>
          <li>
            <strong>Email</strong>: <a href="mailto:gitdig.com@gmail.com">gitdig.com@gmail.com</a>
          </li>
          <li>
            <strong>GitHub</strong>:{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/liujianping">
              liujianping
            </a>
          </li>
        </ul>
      </>
    )
  }
}
