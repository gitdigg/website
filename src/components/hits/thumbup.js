import React, { Component } from "react";
import axios from "axios";

export class Thumbup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            got: false,
            data: {
                thumbs: 0,
                thumbed: false,
                persistStorage: "",
            },
        }
        this.onThumbup = this.onThumbup.bind(this);
    }
    componentDidMount() {
        axios.defaults.baseURL = "https://api.subscriber.one";
        // axios.defaults.baseURL = "http://localhost:8080";
        axios.defaults.withCredentials = true
        const { url, initThumbs } = this.props;
        let persist = localStorage.getItem("_hits_p")
        axios.post("/v1/hits.Counter/ThumbGet", {
            url: url,
            persistStorage: persist === "undefined" ? "": persist,
            initThumbs: initThumbs === null ? 0: initThumbs,
        }).then(
            (response) => {
                this.setState({ got: true, data: response.data })
                localStorage.setItem("_hits_p", response.data.persistStorage)
            }
        )
        return this.state
    }
    onThumbup(e) {
        const { url, initThumbs } = this.props;
        let persist = localStorage.getItem("_hits_p")
        axios.post("/v1/hits.Counter/ThumbUp", {
            persistStorage: persist === "undefined" ? "": persist,
            url: url,
            initThumbs: initThumbs === null ? 0: initThumbs,
        }).then(
            (response) => {
                this.setState({ data: response.data })
                localStorage.setItem("_hits_p", response.data.persistStorage)
            }
        )
    }
    render() {
        const { thumbs, thumbed } = this.state.data;
        const { inline, className } = this.props;
        if (!this.state.got) {
            return <></>
        }
        return (
            <>
                { 
                    inline && 
                        <div onClick={this.onThumbup} className={'tag mr-1 is-light is-info is-small' + className}>
                            <span className="icon">
                                <i className={thumbed ? 'gitdig-thumbed': 'gitdig-thumbup'}></i>
                            </span>                    
                            <span className="is-size-7">x<bold>{thumbs}</bold></span>    
                        </div>                                    
                }
                {
                    !inline && 
                    <div className="action">
                        <div onClick={this.onThumbup} className={'button is-light is-info is-rounded mr-1 is-outlined' + className}>
                            <span className="icon">
                                <i className={thumbed ? 'gitdig-thumbed': 'gitdig-thumbup'}></i>
                            </span>                                                                            
                        </div> 
                        <span className="is-size-6">x<strong>{thumbs}</strong></span>
                    </div>
                }                
            </>
        )
    }
}
