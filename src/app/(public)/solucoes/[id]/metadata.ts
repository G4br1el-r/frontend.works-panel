import type { Metadata } from "next";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { SITE_NAME } from "@/lib/utils/constants";

export function buildSolutionMetadata(segment: SegmentResponseType): Metadata {
  const fullTitle = `${segment.name} | ${SITE_NAME}`;
  const url = `/solucoes/${segment.id}`;

  return {
    title: segment.name,
    description: segment.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: segment.description,
      url,
      images: [
        {
          url: segment.coverImage,
          width: 1200,
          height: 630,
          alt: segment.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: segment.description,
      images: [segment.coverImage],
    },
  };
}
