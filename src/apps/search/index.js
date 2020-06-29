import React from "react";
import { Link } from "gatsby";
import { SEO, Search, SideBar, Post } from "../../components";
import { usePosts } from "../../hooks";
export function AppSearchResult({ text }) {
    const posts = usePosts()
    let result = posts.filter(element => {
        let matched = false
        if (element.node.frontmatter.title.search(text) >= 0) {
            return true
        }

        element.node.frontmatter.keywords.forEach(keyword => {
            if (keyword.search(text) >= 0) {
                matched = true
                return
            }
        })
        if (matched) {
            return true
        }

        if (element.node.rawMarkdownBody.search(text) >= 0) {
            return true
        }
        return false
    })
    return (
        <>
            <SEO />
            <section className="main hero is-light">
                <div className="hero-body">
                    <div className="container">
                        <div className="columns is-mobile">
                            <div className="column is-half is-offset-one-quarter">
                                <Search text={text}></Search>
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
                                <li><Link to={'/q'}>检索</Link></li>
                                <li class="is-active"><Link>{text}</Link></li>
                            </ul>
                        </nav>
                        {
                            result.map((element) => {
                                return (<Post node={element.node}></Post>)
                            })
                        }
                        <p className="has-text-centered has-text-grey">已经到底了</p>
                    </div>
                    <div className="column">
                        <SideBar />
                    </div>
                </div>
            </div>
        </>
    )
}

export function AppSearchDefault({ text }) {
    return (
        <>
            <section class="main hero is-light">
                <div class="hero-body">
                    <div class="container">
                        <div class="columns is-mobile">
                            <div class="column is-half is-offset-one-quarter">
                                <Search ></Search>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container">
                <div className="columns mt-4">
                    <div className="column is-three-quarters">
                        <p className="has-text-centered has-text-grey">请输入检索关键字</p>
                    </div>
                    <div className="column">
                        <SideBar />
                    </div>
                </div>
            </div>
        </>
    )
}

