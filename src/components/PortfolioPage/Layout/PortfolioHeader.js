import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'gatsby'
import ButtonShadow from '../Shared/ButtonShadow'
import { pageData } from '../Portfolio.data'

/**
 * @name PortfolioHeader
 * @summary -
 * @description - Portfolio page - Header
 */

const PortfolioHeader = props => {
  const {
    header: {
      logo: {
        title: titleLogo,
        logo: {
          file: { url: srcLogo },
          svg: svgLogo,
        },
      },
    },
    showIntro,
  } = props

  return (
    <Wrapper>
      <LogoWrapper>
        <Link to="/" aria-label="Go to Homepage">
          <ButtonShadow as="div" short>
            {svgLogo?.content ? (
              <LogoSvgWrapper
                dangerouslySetInnerHTML={{
                  __html: svgLogo?.content,
                }}
              />
            ) : (
              <Logo src={srcLogo} alt={titleLogo} />
            )}
          </ButtonShadow>
        </Link>
      </LogoWrapper>

      {!showIntro && (
        <CtaWrapper>
          <ButtonShadow
            as="a"
            href={pageData.header.rightCta.href}
            target="_blank"
            rel='"noopener noreferrer'
            short
            hoverCircle
          >
            {pageData.header.rightCta.label}
          </ButtonShadow>
        </CtaWrapper>
      )}
    </Wrapper>
  )
}

export default PortfolioHeader

const PHWrapperFadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

const PHWrapperFadeOut = keyframes`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.device.tablet}) {
    justify-content: center;
    animation: ${PHWrapperFadeIn} 0.35s
      ${({ theme }) => theme.easeType.defaultInOut} forwards;

    .show-footer & {
      pointer-events: none;
      animation: ${PHWrapperFadeOut} 0.35s
        ${({ theme }) => theme.easeType.defaultInOut} forwards;
    }
  }
`

const LogoWrapper = styled.div`
  position: relative;
  width: 172px;
  pointer-events: all;
  z-index: 35;

  @media (max-width: ${({ theme }) => theme.device.miniDesktop}) {
    z-index: 30;
  }

  @media (max-width: ${({ theme }) => theme.device.tablet}) {
    width: 116px;

    .show-footer & {
      pointer-events: none;
    }
  }
`

const LogoSvgWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;

  svg {
    width: 132px;
    height: auto;

    @media (max-width: ${({ theme }) => theme.device.tablet}) {
      width: 90px;
    }
  }
`

const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

const CtaWrapper = styled.div`
  position: relative;
  pointer-events: all;
  z-index: 41;

  @media (max-width: ${({ theme }) => theme.device.miniDesktop}) {
    z-index: 30;
  }

  @media (max-width: ${({ theme }) => theme.device.tablet}) {
    display: none;
  }
`
