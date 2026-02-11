"use client";

import FilledImage from "@/components/ui/filled-image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const config = {
    web_url : "",
    // "https://www.rockwool.com/asia/",
    video_url:
      "https://d2tlyqjp4runby.cloudfront.net/media_video_uploader/1770782911590308487_video_hung-dev-test.mp4?Expires=4924382998&Signature=e-VCVg8fNSWIzHxE56cyCayeTUpMfPG3cr~v7azTIAZav3glSjgBzQ9lXIZ6hVwcEe-lU4PNfCIl6PllNw~WfeBB1AYY0IcsRmzi-teVcG0XIdPIu-jykDMjWcyKGTLA18~w3bbAL0gscks4u7cAxiTUjP2r8Q9B6sbbg-vKFEzbFpj4hYXGUcCIMusXZvJQCBFy8kN-Vm7JTsFhueQn1XNZc4PLRZQblh~laYFYSA-CEwpxSjZeHP7FNhRcRZjF0HYR13ZWTmXh4txdygJwpJhxlbWU6CWRBsNH8SvAyqSW4SWCWXoHbwLczmllQVHoetnfuRhKUct0UNjfa5NBDg__&Key-Pair-Id=K1RAOUJU1Q3EVC",
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
  }, [webUrl]);

  useEffect(() => {
    if (hasVideo && videoRef.current) {
      videoRef.current.play().catch((err: unknown) => {
        console.log("Video autoplay prevented:", err);
      });
    }
  }, [hasVideo]);

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
    <div className="relative h-screen w-screen overflow-hidden">
      {isMounted && hasImage ? (
        <FilledImage
          src={config.image_url}
          alt="image"
          fit="contain"
          priority
        />
      ) : hasVideo ? (
        <video
          ref={videoRef}
          src={config.video_url}
          autoPlay
          muted
          loop
          playsInline
          controls
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </div>
  );
}
