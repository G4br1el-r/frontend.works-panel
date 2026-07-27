import {
  BadgeCheck,
  Clock,
  Gem,
  Handshake,
  Home as HomeIcon,
  MapPin,
  ScrollText,
} from "lucide-react";

// src/components/landingpage/about/index.tsx
export const ABOUT_HIGHLIGHTS = [
  { icon: HomeIcon, text: "Atendimento residencial e empresarial" },
  { icon: Clock, text: "Do reparo pontual à obra completa" },
  { icon: ScrollText, text: "Orçamento sem compromisso" },
  { icon: Handshake, text: "Compromisso com prazo em todo projeto" },
  { icon: BadgeCheck, text: "Mais de 20 anos de experiência" },
  { icon: Gem, text: "Materiais de qualidade garantida" },
  { icon: BadgeCheck, text: "Serviço com garantia" },
  { icon: MapPin, text: "Atendimento em toda a região" },
];

// src/components/landingpage/metrics/index.tsx
export const METRICS_ITEMS = [
  { id: "years", value: "8+", label: "ANOS DE EXPERIÊNCIA" },
  { id: "projects", value: "150+", label: "PROJETOS ENTREGUES" },
  { id: "clients", value: "100%", label: "CLIENTES SATISFEITOS" },
  { id: "response", value: "24H", label: "TEMPO DE RESPOSTA" },
];

// src/components/landingpage/marquee/index.tsx
export const MARQUEE_SERVICES = [
  "ELÉTRICA",
  "ALVENARIA E OBRA",
  "PINTURA",
  "HIDRÁULICA",
  "MARCENARIA",
  "ATENDIMENTO RESIDENCIAL E EMPRESARIAL",
  "GESSO E DRYWALL",
  "REVESTIMENTOS",
  "+20 ANOS DE EXPERIÊNCIA",
  "MANUTENÇÃO PREDIAL",
  "MONTAGEM E INSTALAÇÃO",
  "ORÇAMENTO SEM COMPROMISSO",
  "REFORMAS",
  "COMPROMISSO COM PRAZO",
  "DO REPARO À OBRA COMPLETA",
];

// src/components/landingpage/hero/brand-wordmark/index.tsx
export const HERO_BRAND_WORDMARK_LETTERS = [
  { char: "G", id: "letter-1" },
  { char: "O", id: "letter-2" },
  { char: "U", id: "letter-3" },
  { char: "L", id: "letter-4" },
  { char: "A", id: "letter-5" },
  { char: "R", id: "letter-6" },
  { char: "T", id: "letter-7" },
];

// src/components/landingpage/hero/quote-cta/index.tsx
export const HERO_QUOTE_CTA_URL = "/";

// src/components/landingpage/about/index.tsx e src/components/landingpage/hero/quote-cta/index.tsx
export const NOTCHED_BUTTON_CLIP_PATH =
  "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

export const HERO_POSTER_SRC = "/images/hero-poster.webp";

// src/components/landingpage/hero/background-video/index.tsx
export const HERO_BACKGROUND_VIDEO_LEGACY_INLINE_ATTRS = {
  "webkit-playsinline": "true",
  "x5-playsinline": "true",
} as Record<string, string>;
