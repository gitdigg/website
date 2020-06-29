import React from "react";
import { Layout, Search } from "../components";

export default function NotFoundPage() {
    return (
        <Layout>
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
                <div className="columns">
                    <div className="column is-half is-offset-one-quarter">
                        <div class="box border is-radiusless is-shadowless my-6">
                            <br />
                            <h1 class="title has-text-centered ">
                                404
                            </h1>
                            <br />
                            <h2 class="subtitle has-text-centered ">
                                页面不存在 。
                            </h2>
                            <br />
                            <h2 class="subtitle is-6 has-text-centered ">
                                可能是由于网站升级导致的路径变更。
                                 <br />
                                <br />
                                请检索相关关键字查询。
                            </h2>
                            <br />
                            <br />
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
