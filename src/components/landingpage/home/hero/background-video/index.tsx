"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { HERO_BACKGROUND_VIDEO_LEGACY_INLINE_ATTRS } from "@/utils/constants";

interface BackgroundVideoProps {
  sources?: { src: string; type: string }[];
  className?: string;
  /** Só começa a tocar quando o vídeo entra na viewport. */
  playOnInView?: boolean;
}

const DEFAULT_SOURCES = [
  { src: "/videos/video.webm", type: "video/webm" },
  { src: "/videos/video.mp4", type: "video/mp4" },
];

export function BackgroundVideo({
  sources = DEFAULT_SOURCES,
  className,
  playOnInView = false,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const isInView = useInView(videoRef, { once: true, amount: 0.5 });
  const shouldPlay = !playOnInView || isInView;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlay) return;

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
  }, [shouldPlay]);

  return (
    <video
      ref={videoRef}
      className={cn(
        "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
        isReady ? "opacity-100" : "opacity-0",
        className,
      )}
      autoPlay={!playOnInView}
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
      {sources.map(({ src, type }) => (
        <source key={src} src={src} type={type} />
      ))}
    </video>
  );
}
