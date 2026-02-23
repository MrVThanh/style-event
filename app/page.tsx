"use client";

import FilledImage from "@/components/ui/filled-image";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from 'usehooks-ts'

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playAttemptedRef = useRef(false);

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

  useEffect(() => {
    if (!webUrl) return
    // Prefer replace so user can't "back" to this page.
    window.location.replace(webUrl)
  }, [webUrl])

  // Reset video state when the selected video changes
  useEffect(() => {
    playAttemptedRef.current = false
    setVideoError(false)
    setShowPlayHint(false)
  }, [content?.type, contentUrl])

  useEffect(() => {
    if (webUrl) return
    setIsMounted(true);

    // Try to enable autoplay on Safari by triggering early
    const enableAutoplay = () => {
      const video = videoRef.current;
      if (video && hasVideo) {
        video.play().catch(() => {
          // Will retry in the main video effect
        });
      }
    };

    // Small delay to ensure video element is rendered
    if (hasVideo) {
      setTimeout(enableAutoplay, 100);
    }
  }, [hasVideo, webUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (webUrl) return
    if (!hasVideo || !video || playAttemptedRef.current) return;

    playAttemptedRef.current = true;

    // Ensure video is muted for Safari autoplay
    video.muted = true;
    video.playsInline = true;

    const handleError = () => {
      console.error("Video failed to load");
      setVideoError(true);
    };

    const handlePlay = () => {
      setShowPlayHint(false);
    };

    const forcePlay = () => {
      if (video.paused) {
        video.muted = true; // Ensure still muted
        video.play().catch(() => {
          // Silently fail, will be handled by other events
        });
      }
    };

    const attemptPlay = () => {
      // Ensure muted before playing
      video.muted = true;

      // Try to play immediately
      video
        .play()
        .then(() => {
          console.log("Video playing successfully");
          setShowPlayHint(false);
        })
        .catch((err: unknown) => {
          console.log("Initial autoplay prevented:", err);

          // For Safari mobile, try again after a short delay
          setTimeout(() => {
            video.muted = true;
            video
              .play()
              .then(() => setShowPlayHint(false))
              .catch(() => {
                // If still fails, show hint after 2 seconds
                setTimeout(() => {
                  if (video.paused) {
                    setShowPlayHint(true);
                  }
                }, 2000);
              });
          }, 300);
        });
    };

    video.addEventListener("error", handleError);
    video.addEventListener("play", handlePlay);
    video.addEventListener("loadedmetadata", forcePlay);
    video.addEventListener("loadeddata", forcePlay);

    // Try to play on visibility change (when user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused) {
        forcePlay();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Try to play when video can play
    if (video.readyState >= 3) {
      attemptPlay();
    } else {
      video.addEventListener("canplay", attemptPlay, { once: true });
    }

    return () => {
      video.removeEventListener("canplay", attemptPlay);
      video.removeEventListener("error", handleError);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("loadedmetadata", forcePlay);
      video.removeEventListener("loadeddata", forcePlay);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasVideo, webUrl]);

  const handleScreenTap = () => {
    const video = videoRef.current;
    if (video && video.paused) {
      video.muted = true; // Ensure muted
      video
        .play()
        .then(() => {
          setShowPlayHint(false);
          console.log("Video played after user interaction");
        })
        .catch((e: unknown) => {
          console.error("Play failed even after tap:", e);
        });
    }
  };

  const handleTouch = (e: React.TouchEvent) => {
    // Handle touch separately to ensure play on mobile
    handleScreenTap();
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
      onClick={handleScreenTap}
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
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            className="absolute inset-0 h-full w-full object-cover"
            style={
              {
                WebkitPlaysinline: "true",
                objectFit: "cover",
              } as React.CSSProperties
            }
          />
          {showPlayHint && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="text-white text-center px-6">
                <svg
                  className="w-16 h-16 mx-auto mb-4 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <p className="text-lg">Chạm để phát video</p>
              </div>
            </div>
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
