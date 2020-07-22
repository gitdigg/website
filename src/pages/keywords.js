import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "gatsby";
import { Layout, SEO, Search, SideBar, Keyword } from "../components";
import { useConfigs, useKeywords } from "../hooks";

export default function KeywordsPage() {
    const config = useConfigs()
    const keywordCnts = useKeywords()
    let keywords = []
    keywordCnts.forEach(element => {
        keywords.push(element.fieldValue)
    });
    return (
        <Layout>
            <Helmet title={`关键字 | ${config.title}`} />
            <SEO keywords={keywords} />
            <section className="main hero is-light">
                <div className="hero-body">
                    <div className="container">
                        <div className="columns is-mobile">
                            <div className="column is-half is-offset-one-quarter">
                                <Search />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container">
                <div className="columns mt-4 mx-4">
                    <div className="column is-three-quarters">
                        <nav class="breadcrumb" aria-label="breadcrumbs">
                            <ul>
                                <li><Link to={'/'}>主页</Link></li>
                                <li class="is-active"><Link>关键字</Link></li>
                            </ul>
                        </nav>
                        <div class="box border is-radiusless is-shadowless">
                            {
                                keywordCnts.map(element => <Keyword key={element.fieldValue} className={'mx-2 my-1'} name={element.fieldValue} />)
                            }
                        </div>

                    </div>
                    <div className="column">
                        <SideBar />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
