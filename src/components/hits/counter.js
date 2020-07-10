import React, { Component } from "react";
import axios from "axios";
import humanNumber from "human-number";

export class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            got: false,
            data: {
                hits: 0,
                ssns: 0,
                uids: 0,
                sessionStorage: "",
                persistStorage: "",
            },
        }
    }
    componentDidMount() {
        axios.defaults.baseURL = "https://api.subscriber.one";
        // axios.defaults.baseURL = "http://localhost:8080";
        axios.defaults.withCredentials = true
        const { readonly, url, initHits, initSsns, initUids } = this.props;
        if (readonly) {
            let persist = localStorage.getItem("_hits_p")
            axios.post("/v1/hits.Counter/Get", {
                url: url,
                initHits: initHits === null ? 0 : initHits,
                initSsns: initSsns === null ? 0 : initSsns,
                initUids: initUids === null ? 0 : initUids,
            }).then(
                (response) => {
                    this.setState({ got: true, data: response.data })
                }
            )
        } else {
            let session = sessionStorage.getItem("_hits_s")
            let persist = localStorage.getItem("_hits_p")
            axios.post("/v1/hits.Counter/Hit", {
                persistStorage: persist === "undefined" ? "": persist,
                sessionStorage: session === "undefined" ? "": session,
                url: url,
                initHits: initHits === null ? 0 : initHits,
                initSsns: initSsns === null ? 0 : initSsns,
                initUids: initUids === null ? 0 : initUids,
            }).then(
                (response) => {
                    this.setState({ got: true, data: response.data })
                    sessionStorage.setItem("_hits_s", response.data.sessionStorage)
                    localStorage.setItem("_hits_p", response.data.persistStorage)
                }
            )
        }
        return this.state
    }

    render() {
        const { hits, ssns, uids } = this.state.data;
        const { hit, session, user, className} = this.props;
        if (!this.state.got) {
            return <></>
        }
        return (
            <>
                {
                    hit &&
                    // <span className={className}>{hits}</span>
                    <div className={'tag mr-1 small ' + className}>
                        <span className="icon">
                            <i className="gitdig-read"></i>
                        </span>
                        <span className="is-size-7">{humanNumber(hits)}</span>
                    </div>
                }
                {
                    session &&
                    // <span className={className}>{ssns}</span>
                    <div className={'tag mr-1 small ' + className}>
                        <span className="icon">
                            <i className="gitdig-read"></i>
                        </span>                        
                        <span className="is-size-7">{humanNumber(ssns)}</span>
                    </div>
                }
                {
                    user &&
                    // <span className={className}>{uids}</span>
                    <div className={'tag mr-1 small ' + className}>
                        <span className="icon">
                            <i className="gitdig-read"></i>
                        </span>
                        <span className="is-size-7">{humanNumber(uids)}</span>
                    </div>
                }                
            </>
        )
    }
}
