import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "gatsby";
import { Layout, SEO, Search, SideBar, Keyword, Sample, ContentAds } from "../components";
import { useConfigs, useExamples } from "../hooks";

export default function KeywordsPage() {
    const config = useConfigs()
    const examples = useExamples()

    return (
        <Layout>
            <Helmet title={`样例 | ${config.title}`} />
            <SEO />
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
                <div className="columns mt-4">
                    <div className="column is-three-quarters">
                        <nav class="breadcrumb" aria-label="breadcrumbs">
                            <ul>
                                <li><Link to={'/'}>主页</Link></li>
                                <li class="is-active"><Link>样例</Link></li>
                            </ul>
                        </nav>
                        <div className={'columns is-multiline'}>
                            {
                                examples.map((node) => <div className="column is-one-quarter"><Sample node={node} className={''} /></div>)
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
