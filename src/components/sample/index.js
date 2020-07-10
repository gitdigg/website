import React from "react";
import { Link } from 'gatsby';
import Img from 'gatsby-image';

export function Sample({ node, className }) {
    return (
        <>
            {
                node &&
                <div className={'card ' + className}>
                    <header class="card-header">
                        <p class="card-header-title">
                        {node.frontmatter.title}
                        </p>
                    </header>
                    <div className="card-image">
                        {
                            node.frontmatter.image &&
                            <figure className="image">
                                <Img fluid={node.frontmatter.image.childImageSharp.fluid}></Img>
                            </figure>
                        }                        
                    </div>
                    <div className="card-footer">
                        {
                            node.frontmatter.repo && 
                            <Link className='card-footer-item is-size-7' to={node.frontmatter.repo}>
                                <span className="icon">
                                    <i className="gitdig-github"></i>
                                </span>
                                项目源码
                            </Link>
                        }
                        {   
                            node.frontmatter.link &&
                            <Link className='card-footer-item is-size-7' to={node.frontmatter.link}>
                                <span className="icon">
                                    <i className="gitdig-read"></i>
                                </span>                                
                                阅读原文
                            </Link>    
                        }                        
                    </div>
                </div>                
            }
        </>
    )
}