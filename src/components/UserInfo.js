import React, { Component } from 'react'
import GitHubButton from 'react-github-btn'
import authors from '../../data/authors'

export default class UserInfo extends Component {
  render() {
    const { name } = this.props;
    console.log("username", name)
    let author = authors[name];
    if (author == null) {
      return (
        <aside className="note"></aside>
      )
    }
    let image = author.image
    let style = "avatar"
    if (author.qrcode) {
      image = author.qrcode
      style = "qrcode"
    }
    return (
      <aside className="note">
        <div className="container note-container">
          <div className="flex-author">
            <div className="flex-avatar">
              <img className={style} src={image} alt={name} />
            </div>
            <div>
              <h3>{author.name}</h3>
              <p>
                {author.description}
              </p>
              {/* <div className="flex">
                  <div>
                    <GitHubButton
                      href={author.github}
                      data-size="large"
                      data-show-count="true"
                      aria-label="Follow @liujianping on GitHub"
                    >
                      Follow
                    </GitHubButton>
                  </div>
                </div> */}
            </div>
          </div>
        </div>
      </aside>
    )
  }
}
