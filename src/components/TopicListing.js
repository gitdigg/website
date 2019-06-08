import React, { Component } from 'react'
import { Link } from 'gatsby'
import mario from '../../content/thumbnails/mario.png'

export default class TopicListing extends Component {
    render() {
        const { topics, max, more } = this.props;
        topics.sort(function(t1, t2) {
            return t1.weight - t2.weight;
        });
        let currents = [];
        for (let i = 0; i < topics.length; i++) {
            if (i < max) {
                currents.push(topics[i])
            }
        }
        if (more) {
            currents.push({
                icon: mario,
                title: '更多主题',
                path: '/topics/',
                weight: 0,
            })
        }        
        return (<section className="callouts" key="topics">
            {
                currents.map(function(topic, i) {
                    return (<div className="item" key={i}>
                        <Link to={topic.path} className="article-callout">
                            <img src={topic.icon} alt={topic.title} /> {topic.title}
                        </Link>
                    </div>);
                }) 
            }
        </section>);
    }
}
