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

  // Change this value to control what content to show
  // Options: "mobile_video" | "desktop_video" | "mobile_image" | "desktop_image"
  const hasShow = (matches ? "desktop_video" : "mobile_video") as "mobile_video" | "desktop_video" | "mobile_image" | "desktop_image"

  const resource = {
    mobile: {
      video_url: "https://d2tlyqjp4runby.cloudfront.net/media_video_uploader/1770782911590308487_video_hung-dev-test.mp4?Expires=4924382998&Signature=e-VCVg8fNSWIzHxE56cyCayeTUpMfPG3cr~v7azTIAZav3glSjgBzQ9lXIZ6hVwcEe-lU4PNfCIl6PllNw~WfeBB1AYY0IcsRmzi-teVcG0XIdPIu-jykDMjWcyKGTLA18~w3bbAL0gscks4u7cAxiTUjP2r8Q9B6sbbg-vKFEzbFpj4hYXGUcCIMusXZvJQCBFy8kN-Vm7JTsFhueQn1XNZc4PLRZQblh~laYFYSA-CEwpxSjZeHP7FNhRcRZjF0HYR13ZWTmXh4txdygJwpJhxlbWU6CWRBsNH8SvAyqSW4SWCWXoHbwLczmllQVHoetnfuRhKUct0UNjfa5NBDg__&Key-Pair-Id=K1RAOUJU1Q3EVC",
      image_url: "https://pnganime.com/web/image-thumbnails/529/887-md.png",
    },
    desktop: {
      video_url: "https://d2tlyqjp4runby.cloudfront.net/media_video_uploader/1770782911590308487_video_hung-dev-test.mp4?Expires=4924382998&Signature=e-VCVg8fNSWIzHxE56cyCayeTUpMfPG3cr~v7azTIAZav3glSjgBzQ9lXIZ6hVwcEe-lU4PNfCIl6PllNw~WfeBB1AYY0IcsRmzi-teVcG0XIdPIu-jykDMjWcyKGTLA18~w3bbAL0gscks4u7cAxiTUjP2r8Q9B6sbbg-vKFEzbFpj4hYXGUcCIMusXZvJQCBFy8kN-Vm7JTsFhueQn1XNZc4PLRZQblh~laYFYSA-CEwpxSjZeHP7FNhRcRZjF0HYR13ZWTmXh4txdygJwpJhxlbWU6CWRBsNH8SvAyqSW4SWCWXoHbwLczmllQVHoetnfuRhKUct0UNjfa5NBDg__&Key-Pair-Id=K1RAOUJU1Q3EVC",
      image_url: "https://i.pinimg.com/originals/5b/8c/85/5b8c853780def283ec9c6f5b62dbe498.png",
    },
  }

  // Determine content based on hasShow value
  const getContent = () => {
    switch (hasShow) {
      case "mobile_video":
        return {
          type: "video" as const,
          url: resource.mobile.video_url,
        }
      case "mobile_image":
        return {
          type: "image" as const,
          url: resource.mobile.image_url,
        }
      case "desktop_video":
        return {
          type: "video" as const,
          url: resource.desktop.video_url,
        }
      case "desktop_image":
        return {
          type: "image" as const,
          url: resource.desktop.image_url,
        }
      default:
        return null
    }
  }

  const content = getContent()
  const hasVideo = content?.type === "video" && content.url?.trim()
  const hasImage = content?.type === "image" && content.url?.trim()

  useEffect(() => {
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
  }, [hasVideo]);

  useEffect(() => {
    const video = videoRef.current;
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
  }, [hasVideo]);

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

  // If no content matches the criteria, show error
  if (!content) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        <div className="text-center px-6">
          <p className="text-lg">Không có nội dung phù hợp để hiển thị</p>
          <p className="text-sm text-gray-400 mt-2">
            Device: {matches ? "Desktop" : "Mobile"} | Mode: {hasShow}
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
          src={content.url}
          alt="Display image"
          fit="contain"
          priority
        />
      ) : hasVideo ? (
        <>
          <video
            ref={videoRef}
            src={content.url}
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
