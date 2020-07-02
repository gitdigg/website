import React from "react";
import { Link, navigate } from 'gatsby';

export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text ? props.text : '',
        };
        this.onChange = this.onChange.bind(this);
        this.onKeyPressed = this.onKeyPressed.bind(this)
    }

    componentWillMount() {
        if (typeof window !== 'undefined') {
            window.addEventListener("keydown", this.onKeyPressed.bind(this));
        }
    }

    componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.removeEventListener("keydown", this.onKeyPressed.bind(this));
        }
    }

    onKeyPressed(e) {
        if (e.keyCode === 13) {
            navigate('/q/' + this.state.text)
        }
    }

    onChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    // className = { 'button is-light is-info is-rounded ' + (small ? 'is-small' : '') }
    render() {
        const { small, className } = this.props
        const { text } = this.state
        return (
            <div className={'field has-addons ' + className}>
                <div className="control is-expanded">
                    <input aria-label={'search-input'} name="text" value={text} onChange={this.onChange} className={'input ' + (small ? 'is-small' : '')} type="text" placeholder="检索" />
                </div>
                <div className="control">
                    <Link to={'/q/' + text} aria-label={'search-btn'} className={'button is-dark ' + (small ? 'is-small' : '')}>
                        <span className="icon">
                            <i className="gitdig-search"></i>
                        </span>
                    </Link>
                </div>
            </div>
        )
    }
}


