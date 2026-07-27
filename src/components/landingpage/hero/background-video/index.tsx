"use client";

import { useEffect, useRef } from "react";
import {
  HERO_BACKGROUND_VIDEO_LEGACY_INLINE_ATTRS,
  HERO_POSTER_SRC,
} from "@/utils/constants";

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

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
      if (!hasFinished()) tryPlay();
    };
    video.addEventListener("canplay", onCanPlay);

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
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      playsInline
      {...HERO_BACKGROUND_VIDEO_LEGACY_INLINE_ATTRS}
      poster={HERO_POSTER_SRC}
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
