"use client";

import { useEffect, useRef } from "react";

const LEGACY_INLINE_ATTRS = {
  "webkit-playsinline": "true",
  "x5-playsinline": "true",
} as Record<string, string>;

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

    tryPlay();

    const hasFinished = () => video.ended;

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
      {...LEGACY_INLINE_ATTRS}
      preload="auto"
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
