import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import styled from 'styled-components';
import BackgroundImage from 'gatsby-background-image'

const BackgroundSection = ({ className, children }) => (
    <StaticQuery
        query={graphql`
      query {
        desktop: file(relativePath: { eq: "background.png" }) {
          childImageSharp {
            fluid(quality: 90, maxWidth: 1920) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    `}
        render={data => {
            // Set ImageData.
            const imageData = data.desktop.childImageSharp.fluid
            return (
                <BackgroundImage
                    Tag="section"
                    className={className}
                    fluid={imageData}
                    backgroundColor={`#4A5568`}
                >
                    {children}
                </BackgroundImage>
            )
        }}
    />
)

export const StyledBackgroundSection = styled(BackgroundSection)`
  width: 100wh;
  background-position: bottom center;
  background-repeat: repeat-y;
  background-size: cover;
`
