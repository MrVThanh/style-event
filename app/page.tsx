"use client";

import FilledImage from "@/components/ui/filled-image";
import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playAttemptedRef = useRef(false);

  const config = {
    web_url :
    "https://www.rockwool.com/north-america/",
    video_url: "",
      // "https://d2tlyqjp4runby.cloudfront.net/media_video_uploader/1770782911590308487_video_hung-dev-test.mp4?Expires=4924382998&Signature=e-VCVg8fNSWIzHxE56cyCayeTUpMfPG3cr~v7azTIAZav3glSjgBzQ9lXIZ6hVwcEe-lU4PNfCIl6PllNw~WfeBB1AYY0IcsRmzi-teVcG0XIdPIu-jykDMjWcyKGTLA18~w3bbAL0gscks4u7cAxiTUjP2r8Q9B6sbbg-vKFEzbFpj4hYXGUcCIMusXZvJQCBFy8kN-Vm7JTsFhueQn1XNZc4PLRZQblh~laYFYSA-CEwpxSjZeHP7FNhRcRZjF0HYR13ZWTmXh4txdygJwpJhxlbWU6CWRBsNH8SvAyqSW4SWCWXoHbwLczmllQVHoetnfuRhKUct0UNjfa5NBDg__&Key-Pair-Id=K1RAOUJU1Q3EVC",
    image_url:
      // "https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png",
      "",
  };

  const webUrl = config.web_url?.trim();
  const hasImage = config.image_url?.trim();
  const hasVideo = config.video_url?.trim();

  useEffect(() => {
    setIsMounted(true);
    if (webUrl) {
      // Prefer web_url: replace so user can't "back" to this page.
      window.location.replace(webUrl);
    }
    
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
    if (hasVideo && !webUrl) {
      setTimeout(enableAutoplay, 100);
    }
  }, [webUrl, hasVideo]);

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
      video.play()
        .then(() => {
          console.log("Video playing successfully");
          setShowPlayHint(false);
        })
        .catch((err: unknown) => {
          console.log("Initial autoplay prevented:", err);
          
          // For Safari mobile, try again after a short delay
          setTimeout(() => {
            video.muted = true;
            video.play()
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
      video.play()
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
    );
  }

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden bg-black"
      onClick={handleScreenTap}
      onTouchEnd={handleTouch}
    >
      {isMounted && hasImage ? (
        <FilledImage
          src={config.image_url}
          alt="image"
          fit="contain"
          priority
        />
      ) : hasVideo ? (
        <>
          <video
            ref={videoRef}
            src={config.video_url}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            className="absolute inset-0 h-full w-full object-cover"
            style={{ 
              WebkitPlaysinline: 'true',
              objectFit: 'cover'
            } as React.CSSProperties}
          />
          {showPlayHint && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="text-white text-center px-6">
                <svg 
                  className="w-16 h-16 mx-auto mb-4 animate-pulse" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z"/>
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
          <p>Không có nội dung để hiển thị</p>
        </div>
      )}
    </div>
  );
}
