import React from "react";
import { Router } from "@reach/router";
import { Layout, SEO } from "../components";
import { AppSearchResult, AppSearchDefault } from "../apps";

export default function QueryPage() {
    return (
        <Layout>
            <SEO />
            <Router basepath="/q">
                <AppSearchResult path="/:text" />
                <AppSearchDefault path="/" />
            </Router>
        </Layout>
    )
}