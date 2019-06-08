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
    return (
      <aside className="note">
        <div className="container note-container">
          <div className="flex-author">
            <div className="flex-avatar">
              <img className="avatar" src={author.image} alt={name} />
            </div>
            <div>
              <h4>I am {author.name}</h4>
              <p>
                {author.description}
              </p>
              <div className="flex">
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
              </div>
            </div>
          </div>
        </div>
      </aside>
    )
  }
}
