import React from 'react';
import styled from 'styled-components';

const ImageBox = styled.div`
  background-image: url(${props => props.image});
  height: ${props => props.small ? '90px' : '360px'};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 0.25rem;
`

export function Picture({ image, small, children }) {
    return (
        <ImageBox image={image}>
            {children}
        </ImageBox>
    )
}