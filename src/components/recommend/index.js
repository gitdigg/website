import React from "react";

export function Recommend({ name, children, className }) {
    return (
        <div className={'mx-4 my-4' + className}>
            <div className="mb-2">
                <p className="title is-6">{name}</p>
            </div>
            <div className="recommend-body">
                {children}
            </div>
        </div>
    )
}