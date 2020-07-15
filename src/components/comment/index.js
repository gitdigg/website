import React from "react";
import { Link } from 'gatsby';

export function Comment({ inline, count,className }) {
    return (
        <>
            { 
                inline && 
                <div className={'tag mr-1 is-light is-small tag' + className}>
                    <span className="icon">
                        <i className={'gitdig-comment'}></i>
                    </span>      
                    {
                        count &&
                        <span className="is-size-7"><strong>{count}</strong></span>    
                    }                                  
                </div>                
            }
            {
                !inline && 
                <div className="action my-2">
                    <Link to={"#gitalk"} className={'button is-light is-info is-rounded mr-1 is-outlined' + className}>
                        <span className="icon">
                            <i className={'gitdig-comment'}></i>
                        </span>                                                                            
                    </Link> 
                    {
                        count &&
                        <span className="is-size-6">x<strong>{count}</strong></span>
                    }                    
                </div>
            }                
        </>
    )
}
