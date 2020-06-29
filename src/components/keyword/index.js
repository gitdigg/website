import React from "react";
import { Link } from 'gatsby';
const kebabCase = require('lodash.kebabcase')

export function Keyword({ name, className }) {
    return (
        <Link to={`/keyword/${kebabCase(name)}/`} className={'tag is-success is-light ' + className} >
            {name}
        </Link >
    )
}