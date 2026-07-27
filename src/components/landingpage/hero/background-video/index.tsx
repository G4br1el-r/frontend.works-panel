"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { HERO_BACKGROUND_VIDEO_LEGACY_INLINE_ATTRS } from "@/utils/constants";

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const tryPlay = () => {
      const attempt = video.play();
      if (attempt) {
        attempt.catch(() => {});
      }
    };

    video.load();
    tryPlay();

    const hasFinished = () => video.ended;

    const onCanPlay = () => {
      setIsReady(true);
      if (!hasFinished()) tryPlay();
    };
    video.addEventListener("canplay", onCanPlay);

    if (video.readyState >= video.HAVE_CURRENT_DATA) setIsReady(true);

    const onVisibility = () => {
      if (!document.hidden && !hasFinished()) tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onFirstInteraction = () => {
      if (!hasFinished()) tryPlay();
    };
    document.addEventListener("touchstart", onFirstInteraction, { once: true });
    document.addEventListener("click", onFirstInteraction, { once: true });

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("touchstart", onFirstInteraction);
      document.removeEventListener("click", onFirstInteraction);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={cn(
        "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
        isReady ? "opacity-100" : "opacity-0",
      )}
      autoPlay
      muted
      playsInline
      {...HERO_BACKGROUND_VIDEO_LEGACY_INLINE_ATTRS}
      preload="none"
      disablePictureInPicture
      disableRemotePlayback
      controls={false}
      tabIndex={-1}
      aria-hidden="true"
    >
      <source src="/videos/video.webm" type="video/webm" />
      <source src="/videos/video.mp4" type="video/mp4" />
    </video>
  );
}
