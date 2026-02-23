"use client";

import FilledImage from "@/components/ui/filled-image";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from 'usehooks-ts'

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const matches = useMediaQuery('(min-width: 768px)')

  // Web : "https://www.rockwool.com"
  // Video : "https://d2tlyqjp4runby.cloudfront.net/media_video_uploader/1771837786864355651_video_hung-dev-test.mp4?Expires=4925437789&Signature=Fj6~P6NnVJq9KSscGLSFHNbYxYaZwrsbNrlZp~tFvrNPKROuR4AtHv9CYMcGcaRdk9eTZHxIAAl91myVIspxcX9Zj8kV3qaVnYClrlE2bBZXs8JEdb9uU34s-x6QKkhMdKKF3wJn0PUSImyBh1IEgGjibgN6JQ~~~cqQjAZ05Zm4TfOg2vGUJlgvSAcJvR8yeLfsc-qFtYREmxhlXXCI7o0Bh3ATu778S2cZv5NCvSJP4KnQho1TiMH8J0-B5C~XTdiJNwTAPCYznfcrEOETu~NJ71Zv01uc9ovMlhYqChrXQhGCeMQVb5rZeg2thw1FgDl9NNFqtgnsk5xD948ezw__&Key-Pair-Id=K1RAOUJU1Q3EVC"
  // Image : "https://i.pinimg.com/originals/5b/8c/85/5b8c853780def283ec9c6f5b62dbe498.png"
  const resource = {
    web_url : "",
    mobile: {
      video_url: "https://d2tlyqjp4runby.cloudfront.net/media_video_uploader/1771837786864355651_video_hung-dev-test.mp4?Expires=4925437789&Signature=Fj6~P6NnVJq9KSscGLSFHNbYxYaZwrsbNrlZp~tFvrNPKROuR4AtHv9CYMcGcaRdk9eTZHxIAAl91myVIspxcX9Zj8kV3qaVnYClrlE2bBZXs8JEdb9uU34s-x6QKkhMdKKF3wJn0PUSImyBh1IEgGjibgN6JQ~~~cqQjAZ05Zm4TfOg2vGUJlgvSAcJvR8yeLfsc-qFtYREmxhlXXCI7o0Bh3ATu778S2cZv5NCvSJP4KnQho1TiMH8J0-B5C~XTdiJNwTAPCYznfcrEOETu~NJ71Zv01uc9ovMlhYqChrXQhGCeMQVb5rZeg2thw1FgDl9NNFqtgnsk5xD948ezw__&Key-Pair-Id=K1RAOUJU1Q3EVC",
      image_url: "",
    },
    desktop: {
      video_url: "https://d2tlyqjp4runby.cloudfront.net/media_video_uploader/1771837786864355651_video_hung-dev-test.mp4?Expires=4925437789&Signature=Fj6~P6NnVJq9KSscGLSFHNbYxYaZwrsbNrlZp~tFvrNPKROuR4AtHv9CYMcGcaRdk9eTZHxIAAl91myVIspxcX9Zj8kV3qaVnYClrlE2bBZXs8JEdb9uU34s-x6QKkhMdKKF3wJn0PUSImyBh1IEgGjibgN6JQ~~~cqQjAZ05Zm4TfOg2vGUJlgvSAcJvR8yeLfsc-qFtYREmxhlXXCI7o0Bh3ATu778S2cZv5NCvSJP4KnQho1TiMH8J0-B5C~XTdiJNwTAPCYznfcrEOETu~NJ71Zv01uc9ovMlhYqChrXQhGCeMQVb5rZeg2thw1FgDl9NNFqtgnsk5xD948ezw__&Key-Pair-Id=K1RAOUJU1Q3EVC",
      image_url: "",
    },
  }

  // Pick the first valid URL for the current device:
  // web_url (handled separately) → video_url → image_url → fallback device
  const pickContent = () => {
    const primary = matches ? resource.desktop : resource.mobile
    const secondary = matches ? resource.mobile : resource.desktop

    const primaryVideo = primary.video_url?.trim()
    const primaryImage = primary.image_url?.trim()
    const secondaryVideo = secondary.video_url?.trim()
    const secondaryImage = secondary.image_url?.trim()

    if (primaryVideo) return { type: "video" as const, url: primaryVideo }
    if (primaryImage) return { type: "image" as const, url: primaryImage }
    if (secondaryVideo) return { type: "video" as const, url: secondaryVideo }
    if (secondaryImage) return { type: "image" as const, url: secondaryImage }
    return null
  }

  const content = pickContent()
  const contentUrl = content?.url?.trim() ?? ""
  const hasVideo = content?.type === "video" && Boolean(contentUrl)
  const hasImage = content?.type === "image" && Boolean(contentUrl)
  const webUrl = resource.web_url?.trim()
  const videoLink = hasVideo ? contentUrl : ""

  useEffect(() => {
    if (!webUrl) return
    // Prefer replace so user can't "back" to this page.
    window.location.replace(webUrl)

  }, [webUrl])

  useEffect(() => {
    if (webUrl) return
    if (!videoLink) return
    window.location.replace(videoLink)
  }, [webUrl, videoLink])

  // Reset video state when the selected content changes
  useEffect(() => {
    setVideoError(false)
    setIsPlaying(false)
  }, [content?.type, contentUrl])

  useEffect(() => {
    if (webUrl || videoLink) return
    setIsMounted(true);
  }, [webUrl, videoLink]);

  useEffect(() => {
    if (webUrl || videoLink) return
    const video = videoRef.current;
    if (!hasVideo || !video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePlaying = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => setVideoError(true);

    video.addEventListener("play", handlePlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
    };
  }, [hasVideo, webUrl, videoLink, contentUrl]);

  const handlePlayClick = async () => {
    const video = videoRef.current;
    if (!video) return
    try {
      video.muted = false;
      video.volume = 1;
      await video.play();
      setIsPlaying(true);
    } catch (e) {
      console.error("Play failed:", e);
    }
  };

  const handleTouch = (e: React.TouchEvent) => {
    // Handle touch separately to ensure play on mobile
    // No-op: user must tap play button
  };

  if (webUrl) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        <a href={webUrl} className="underline">
          Opening website...
        </a>
      </div>
    )
  }

  if (videoLink) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        <a href={videoLink} className="underline">
          Opening video...
        </a>
      </div>
    )
  }

  // If no content matches the criteria, show error
  if (!content) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        <div className="text-center px-6">
          <p className="text-lg">Không có nội dung phù hợp để hiển thị</p>
          <p className="text-sm text-gray-400 mt-2">
            Device: {matches ? "Desktop" : "Mobile"}
          </p>
        </div>
      </div>
    )
  }

  // Show loading state on server-side to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black"
      onTouchEnd={handleTouch}
    >
      {hasImage ? (
        <FilledImage
          src={contentUrl}
          alt="Display image"
          fit="contain"
          priority
        />
      ) : hasVideo ? (
        <>
          <video
            ref={videoRef}
            src={contentUrl}
            controls
            playsInline
            preload="metadata"
            disablePictureInPicture
            className="absolute inset-0 h-full w-full object-cover"
            style={
              {
                WebkitPlaysinline: "true",
                objectFit: "cover",
              } as React.CSSProperties
            }
          />
          {!isPlaying && !videoError && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayClick();
              }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[1px]"
              aria-label="Play video"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg">
                <svg
                  className="h-10 w-10 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
          {videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
              <p className="text-center px-4">
                Video không thể tải. Vui lòng thử lại hoặc mở bằng trình duyệt.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
          <div className="text-center px-6">
            <p className="text-lg">Không có nội dung để hiển thị</p>
            <p className="text-sm text-gray-400 mt-2">
              URL không hợp lệ hoặc bị thiếu
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
