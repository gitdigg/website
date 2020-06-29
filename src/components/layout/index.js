import React from "react";
import { Helmet } from "react-helmet";
import "../../styles/main.scss";
import "../../styles/gitdig.css";
import { Navigation } from "../navigation";
import { Footer } from "../footer";
import { SideBar } from "../sidebar";
import { Search } from "../search";

export function LayoutWithSideBar({ children }) {
    return (
        <>
            <Helmet>
                <html lang="zh-CN" prefix="og: http://ogp.me/ns#" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
            </Helmet>
            <Navigation />
            <div className="container main">
                <div className="columns mt-4">
                    <div className="column is-three-quarters">
                        {children}
                    </div>
                    <div className="column">
                        <div class="box border is-radiusless is-shadowless">
                            <Search />
                        </div>
                        <SideBar />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}


export function Layout({ children }) {
    return (
        <>
            <Helmet>
                <html lang="zh-CN" prefix="og: http://ogp.me/ns#" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
            </Helmet>
            <Navigation />
            {children}
            <Footer />
        </>
    )
}
