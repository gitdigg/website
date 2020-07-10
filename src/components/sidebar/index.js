import React from "react";
import { Topic } from "../topic";
import { Recommend } from "../recommend";
import { SquareAds } from "../googleads";
import { useTopics } from "../../hooks";
import wexin from '../../images/qrcode.png';

export function SideBar() {
    const topics = useTopics()
    return (
        <>
            <Recommend name={'主题'}>{topics.map((topic, idx) =>
                <Topic key={idx} className={'my-1 is-light'} node={topic}></Topic>
            )}</Recommend>
            <Recommend className="my-4 p-2">
                <SquareAds/>
            </Recommend>
            <Recommend name={'微信公众号'}>
                <figure className="image is-128x128 mx-2 my-3">
                    <img src={wexin} alt="wechat" />
                </figure>   
            </Recommend>         
            
        </>
    )
}