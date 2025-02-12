import React, { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import styled from 'styled-components'
import { useFrame } from '@studio-freight/hamo'
import Lenis from '@studio-freight/lenis'
import classnames from 'classnames'
import { useMediaQuery } from 'react-responsive'
import { useDeviceDetect } from '../../../../hooks/useDeviceDetect'

import RiveIcon from './Elements/RiveIcon'
import VideoModal from './Elements/VideoModal'
import VideoButton from './Elements/VideoButton'
import NetworksLogos from './Elements/NetworksLogos'
import AdditionalResources from './Elements/AdditionalResources'
import Buttons from './Elements/Buttons'
import { pageData } from '../../Portfolio.data'

/**
 * @name PortfolioMapSidebar
 * @summary -
 * @description - Portfolio page - Map sidebar
 */

const PortfolioMapSidebar = props => {
  const { canvas, detailPage, setDetailPage, setHideNav } = props
  const [detailPageData, setDetailPageData] = useState(null)
  const [show, setShow] = useState(false)
  const [reset, setReset] = useState(false)
  const [lenis, setLenis] = useState()
  const [showVideo, setShowVideo] = useState(false)
  const wrapperRef = useRef()
  const contentRef = useRef()
  const isDesktop = useMediaQuery({
    query: `(min-width: 993px)`,
  })
  const el = useRef(null)
  const q = gsap.utils.selector(el)
  const barRef = useRef(null)

  const { isWindows, isSafari } = useDeviceDetect()
  const lerp = isWindows || isSafari ? 1 : 0.2
  const wheelMultiplier = isWindows || isSafari ? 1 : 0.7

  const animationIn = () => {
    const sidebar = q(`.${Sidebar.styledComponentId}`)
    const bgOverlay = q(`.${BgOverlay.styledComponentId}`)
    const content = q(`.${ContentInner.styledComponentId}`)
    const contentOuter = q(`.${ContentOuter.styledComponentId}`)
    const scrollBarContainer = q(`.${ScrollBarContainer.styledComponentId}`)

    gsap.set([el?.current, sidebar], { clearProps: 'all' })
    gsap
      .timeline({
        defaults: {
          ease: 'expo.out',
        },
      })
      .addLabel('start')
      .fromTo(
        [contentOuter, scrollBarContainer],
        {
          xPercent: () => (isDesktop ? -100 : 0),
        },
        {
          xPercent: 0,
          duration: 0.75,
        },
        'start'
      )
      .fromTo(
        content,
        {
          autoAlpha: () => (isDesktop ? 1 : 1),
          xPercent: () => (isDesktop ? 0 : 0),
        },
        {
          autoAlpha: () => (isDesktop ? 1 : 1),
          xPercent: () => (isDesktop ? 0 : 0),
          delay: isDesktop ? 0 : 0.25,
          duration: isDesktop ? 0.75 : 0.5,
        },
        'start'
      )
      .fromTo(
        el?.current,
        {
          autoAlpha: () => (isDesktop ? 1 : 0.25),
          yPercent: () => (isDesktop ? 0 : 10),
        },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.75,
        },
        'start'
      )
      .fromTo(
        bgOverlay,
        {
          autoAlpha: 0,
          yPercent: () => (isDesktop ? 0 : -10),
        },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.75,
        },
        'start'
      )
  }

  const animationOut = onCompleteFn => {
    const bgOverlay = q(`.${BgOverlay.styledComponentId}`)
    const contentOuter = q(`.${ContentOuter.styledComponentId}`)
    const scrollBarContainer = q(`.${ScrollBarContainer.styledComponentId}`)

    gsap
      .timeline({
        defaults: {
          ease: 'expo.out',
        },
      })
      .addLabel('start')
      .fromTo(
        [contentOuter, scrollBarContainer],
        {
          xPercent: 0,
        },
        {
          xPercent: () => (isDesktop ? -100 : 0),
          duration: 0.75,
          onComplete: () => {
            onCompleteFn && onCompleteFn()
            gsap.set(barRef?.current, { scaleY: () => (isDesktop ? 0 : 1) })
            gsap.set(barRef?.current, { scaleX: () => (isDesktop ? 1 : 0) })
          },
        },
        'start'
      )
      .fromTo(
        el?.current,
        {
          autoAlpha: 1,
          yPercent: 0,
        },
        {
          autoAlpha: () => (isDesktop ? 1 : 0),
          yPercent: () => (isDesktop ? 0 : 10),
          duration: 0.75,
        },
        'start'
      )
      .fromTo(
        bgOverlay,
        {
          autoAlpha: 1,
          yPercent: 0,
        },
        {
          autoAlpha: 0,
          yPercent: () => (isDesktop ? 0 : -10),
          duration: 0.75,
        },
        'start'
      )
  }

  useEffect(() => {
    const lenis = new Lenis({
      wrapper: wrapperRef.current, // element which has overflow
      content: contentRef.current, // usually wrapper's direct child
      lerp: lerp,
      smoothWheel: true,
      normalizeWheel: true,
      wheelMultiplier: wheelMultiplier,
      smoothTouch: false,
      touchInertiaMultiplier: 15,
      syncTouch: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      infinite: false,
    })

    lenis.start()
    setLenis(lenis)

    return () => {
      lenis.destroy()
    }
  }, [lerp, wheelMultiplier])

  useFrame(time => {
    lenis?.raf(time)
  }, [])

  useEffect(() => {
    if (reset) {
      lenis?.scrollTo(0, { immediate: true })
      setReset(false)
    }
  }, [reset, lenis])

  const handleClickClose = () => {
    setDetailPage(null)
    canvas.current.unfocus()
  }

  const onCompleteFn = () => {
    setShow(false)
    setHideNav(false)
  }

  useEffect(() => {
    if (detailPage !== null) {
      setDetailPageData(pageData?.features[detailPage])
      setReset(true)
      setShow(true)
      animationIn()
      setHideNav(!isDesktop)
    }

    return () => {
      if (detailPage !== null) {
        animationOut(onCompleteFn)
      }
    }
  }, [detailPage, setShow])

  useEffect(() => {
    const updateScroll = event => {
      if (barRef) {
        if (event.scroll === 0) {
          isDesktop
            ? (barRef.current.style.transform = `scaleY(0)`)
            : (barRef.current.style.transform = `scaleX(0)`)
        } else {
          isDesktop
            ? (barRef.current.style.transform = `scaleY(${event.progress})`)
            : (barRef.current.style.transform = `scaleX(${event.progress})`)
        }
      }
    }

    if (show) {
      lenis?.on('scroll', updateScroll)

      const contentOuter = q(`.${ContentOuter.styledComponentId}`)
      if (el?.current.offsetHeight === contentOuter[0].scrollHeight) {
        isDesktop
          ? (barRef.current.style.transform = `scaleY(1)`)
          : (barRef.current.style.transform = `scaleX(1)`)
      }
    }

    return () => {
      updateScroll && lenis?.off('scroll', updateScroll)
    }
  }, [lenis, show, barRef, isDesktop, q])

  return (
    <Wrapper
      ref={el}
      $isVisible={show}
      className={classnames({
        show: detailPage !== null,
        hide: detailPage === null,
        showVideo: showVideo,
      })}
    >
      <ContentWrapper ref={wrapperRef}>
        <Content ref={contentRef}>
          <BgOverlay onClick={handleClickClose}></BgOverlay>

          <Sidebar>
            <ScrollBarContainer>
              <ScrollBar>
                <Bar ref={barRef} $color={detailPageData?.color}></Bar>
              </ScrollBar>
            </ScrollBarContainer>

            <ContentOuter>
              <ContentInner>
                {show && (
                  <RiveIcon
                    src={detailPageData?.riveIcon}
                    color={detailPageData?.color}
                  />
                )}

                <Heading>{detailPageData?.detailPage?.title}</Heading>

                <SubHeading
                  dangerouslySetInnerHTML={{
                    __html: detailPageData?.detailPage?.subtitle,
                  }}
                />

                <Hr />

                <Description
                  dangerouslySetInnerHTML={{
                    __html: detailPageData?.detailPage?.description,
                  }}
                />

                {detailPageData?.detailPage?.logos && (
                  <>
                    {detailPageData?.detailPage?.logos.map(
                      ({ title, list }, id) => {
                        return (
                          <div key={id}>
                            <Hr />

                            {title && (
                              <Description>
                                {title} <br /> <br />
                              </Description>
                            )}

                            <NetworksLogos logosList={list} />
                          </div>
                        )
                      }
                    )}
                  </>
                )}

                {detailPageData?.detailPage?.video && (
                  <>
                    <Hr $fullWidth={true} />

                    <SubHeading>
                      {detailPageData?.detailPage?.video.title}
                    </SubHeading>

                    <VideoButton
                      posterImage={
                        detailPageData?.detailPage?.video.posterImage
                      }
                      onClick={() => setShowVideo(true)}
                    />
                  </>
                )}

                {detailPageData?.detailPage?.links && (
                  <>
                    <Hr $fullWidth={true} />

                    <SubHeading>
                      {detailPageData?.detailPage?.links?.title}
                    </SubHeading>

                    <AdditionalResources
                      links={detailPageData?.detailPage?.links}
                    />
                  </>
                )}
              </ContentInner>
            </ContentOuter>
          </Sidebar>
        </Content>
      </ContentWrapper>

      {showVideo && (
        <VideoModal
          embedUrl={detailPageData?.detailPage?.video?.embedUrl}
          setShowVideo={setShowVideo}
        />
      )}

      <Buttons handleClickClose={handleClickClose} />
    </Wrapper>
  )
}

export default PortfolioMapSidebar

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  z-index: 40;

  &.showVideo {
    z-index: 50;
  }

  @media (max-width: ${({ theme }) => theme.device.miniDesktop}) {
    z-index: 31;
  }
`

const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  scrollbar-width: none !important;
  -ms-overflow-style: none;
  z-index: 31;

  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }

  @media (max-width: ${({ theme }) => theme.device.miniDesktop}) {
    overflow-x: hidden;
    width: calc(100vw - 40px);
    height: calc(100svh - 140px);
    margin: 20px;
    border-radius: 8px;
  }

  @media (max-width: ${({ theme }) => theme.device.tablet}) {
    width: calc(100vw - 30px);
    height: calc(100svh - 100px);
    margin: 15px;
  }

  @media only screen and (max-device-width: 1366px) and (orientation: landscape) {
    height: 100svh;
  }
`

const ScrollBarContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  max-width: 600px;
  display: flex;
  justify-content: flex-end;
  top: 0;
  left: 0;
  z-index: 31;

  @media (max-width: ${({ theme }) => theme.device.miniDesktop}) {
    position: sticky;
    top: 0;
    left: 0;
    height: 15px;
    max-width: none;
    justify-content: flex-start;
  }

  @media (max-width: ${({ theme }) => theme.device.tablet}) {
    height: 9px;
  }
`

const ScrollBar = styled.div`
  position: relative;
  width: 9px;
  height: 100%;
  background-color: #e7e7e7;

  @media (max-width: ${({ theme }) => theme.device.miniDesktop}) {
    width: 100%;
    height: 15px;
  }

  @media (max-width: ${({ theme }) => theme.device.tablet}) {
    height: 9px;
  }
`

const Bar = styled.div`
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: top;
  transform: scaleY(0);
  background-color: ${({ $color }) => ($color ? $color : 'black')};

  @media (max-width: ${({ theme }) => theme.device.miniDesktop}) {
    transform-origin: left center;
  }
`

const BgOverlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(30, 31, 37, 0.4);
`

const Content = styled.div`
  position: relative;

  @media only screen and (min-device-width: 993px) and (max-device-width: 1024px) and (orientation: portrait) {
    -ms-touch-action: none;
    touch-action: none;
    overflow: hidden;
  }

  @media only screen and (max-device-width: 1366px) and (orientation: landscape) {
    -ms-touch-action: none;
    touch-action: none;
    overflow: hidden;
  }
`

const Sidebar = styled.div`
  position: relative;
  pointer-events: none;
`

const ContentOuter = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  min-height: 100vh;
  padding: 50px 50px 80px;
  background-color: #ffffff;
  z-index: 30;
  pointer-events: all;

  @media (max-width: ${({ theme }) => theme.device.miniDesktop}) {
    padding: 30px 105px 50px;
    max-width: none;
  }

  @media (max-width: ${({ theme }) => theme.device.tablet}) {
    padding: 30px 45px 50px;
  }
`
const ContentInner = styled.div`
  position: relative;
  color: #161616;
`

const Heading = styled.h2`
  font-weight: 400;
  font-size: 50px;
  line-height: 1;
  text-align: center;
  margin: 10px 0 50px;
  letter-spacing: -0.02em;
  color: #161616;

  @media (max-width: ${({ theme }) => theme.device.tablet}) {
    font-size: 40px;
    line-height: 1.1;
    margin: 10px 0 30px;
  }
`

const SubHeading = styled.h3`
  font-weight: 400;
  font-size: 24px;
  line-height: 1.35;
  color: #161616;

  @media (max-width: ${({ theme }) => theme.device.tablet}) {
    font-size: 16px;
    line-height: 1.5;
  }

  a {
    color: #161616;
    text-decoration-line: underline !important;
    text-underline-offset: 3px !important;

    &:hover {
      color: #7e7e7e;
    }
  }
`

const Hr = styled.div`
  position: relative;
  padding: ${({ $fullWidth }) => ($fullWidth ? '50px 0' : '25px 0')};
  width: ${({ $fullWidth }) => ($fullWidth ? 'calc(100% + 100px)' : 'auto')};
  margin: ${({ $fullWidth }) => ($fullWidth ? ' 0 -50px' : '0')};

  @media (max-width: ${({ theme }) => theme.device.tablet}) {
    padding: ${({ $fullWidth }) => ($fullWidth ? '30px 0' : '20px 0')};
  }

  &:before {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background-color: #ececec;
  }
`

const Description = styled.p`
  margin: 0;

  a {
    color: #161616;
    text-decoration-line: underline !important;
    text-underline-offset: 3px !important;

    &:hover {
      color: #7e7e7e;
    }
  }
`
