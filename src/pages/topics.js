import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../layout'
import SEO from '../components/SEO'
import TopicListing from '../components/TopicListing'
import config from '../../data/SiteConfig'
import topics from '../../data/topics'

export default class TopicsPage extends Component {
  render() {
    return (
      <Layout>
        <SEO />
        <Helmet title={`Topics – ${config.siteTitle}`} />
        <div className="container">
            <section className="section">
                <TopicListing topics={topics} max={100}/>
            </section>
        </div>
      </Layout>
    )
  }
}