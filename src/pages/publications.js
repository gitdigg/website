import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Layout from '../layout'
import config from '../../data/SiteConfig'
import publications from '../../data/publications'
import segmentfault from '../../content/thumbnails/segmentfault.png'
import jianshu from '../../content/thumbnails/jianshu.png'
import juejin from '../../content/thumbnails/juejin.png'

export default class PublicationsPage extends Component {
  render() {
    const logoMap = {
      Segmentfault: segmentfault,
      Jianshu: jianshu,
      Juejin: juejin,
    }

    const pubs = Object.entries(publications)
    return (
      <Layout>
        <Helmet title={`第三方平台 – ${config.siteTitle}`} />
        <div className="container">
          {pubs.map((publication, i) => {
            const company = publication[0]
            const articles = publication[1]

            return (
              <article>
                <h2 className="publication-company">
                  <img src={logoMap[company]} alt="Company" />
                  {company}
                </h2>
                <ul key={i}>
                  {articles.map((article, i) => {
                    return (
                      <li key={i}>
                        <a href={article.path} target="_blank" rel="noopener noreferrer">
                          {article.title}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </article>
            )
          })}
        </div>
      </Layout>
    )
  }
}
