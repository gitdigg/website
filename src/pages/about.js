import React from "react";
import { Social, StyledBackgroundSection } from "../components";
import { Link } from 'gatsby';
import wexin from "../images/qrcode.png"
// import styled from 'styled-components';

// const BackgroundPage = styled.section`
//   background-image: url(${props => props.image});
//   background-position: center;
//   background-repeat: no-repeat;
//   background-size: cover;
//   height: 100vh;
// `

export default function AboutPage() {
    return (
        <StyledBackgroundSection className="hero is-fullheight flex-top">
            {/* <div class="hero-body"> */}
            <div class="mt-6 flex-center has-text-centered">
                <h1 class="title">
                    寄居蟹 - GitDiG.com
                </h1>
                <Social />
                <figure className="image is-128x128 mx-2 my-3">
                    <img src={wexin} alt="wechat" />
                </figure>
                <Link to={"/"} className='button is-dark is-small'>返回首页</Link>
            </div>
            {/* </div> */}
        </StyledBackgroundSection>
    )
}



