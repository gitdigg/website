import React, { Component } from "react";
import { Link } from "gatsby";
import { Social } from "../social";

export class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
        };
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle() {
        this.setState({ toggle: !this.state.toggle });
    }

    render() {
        const { toggle } = this.state;
        return (
            <nav className="navbar is-dark is-fixed-top" role="navigation" aria-label="main navigation">
                <section className="container">
                    <div className="navbar-brand">
                        <Link className="navbar-item" to="/">
                            {/* <Img
                                fluid={data.file.childImageSharp.fluid}
                                alt="logo"
                                height="28"
                            /> */}
                            <img src="/apple-touch-icon.png" height="32" alt="logo" />
                            <h1 className="title is-6 has-text-light ml-1">寄居蟹 - GitDiG.com</h1>
                        </Link>
                        <a className="navbar-burger burger" onClick={this.onToggle} aria-label="menu" aria-expanded="false" data-target="nav-menu">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>
                    <div id="nav-menu" className={'navbar-menu ' + (toggle ? 'is-active' : '')}>
                        <div className="navbar-end title is-6">
                            <Link className="navbar-item" to="/articles">
                                文章
                            </Link>
                            <Social className="navbar-item" />
                        </div>
                    </div>
                </section>
            </nav>
        )
    }
}
