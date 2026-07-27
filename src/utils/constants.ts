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

// src/components/landingpage/services/index.tsx
export const SERVICES_ITEMS = [
  {
    id: "eletrica",
    title: "ELÉTRICA",
    description:
      "Instalações, quadros, tomadas e correção de falhas com segurança e norma técnica.",
    image: "/images/drill.jpeg",
  },
  {
    id: "alvenaria",
    title: "ALVENARIA E OBRA",
    description:
      "Do reparo pontual à obra completa, com acabamento firme e prazo respeitado.",
    image: "/images/drill.jpeg",
  },
  {
    id: "pintura",
    title: "PINTURA",
    description:
      "Preparo de superfície, massa e pintura interna ou externa com acabamento uniforme.",
    image: "/images/drill.jpeg",
  },
  {
    id: "hidraulica",
    title: "HIDRÁULICA",
    description:
      "Vazamentos, tubulações, louças e metais instalados e revisados sem retrabalho.",
    image: "/images/drill.jpeg",
  },
  {
    id: "marcenaria",
    title: "MARCENARIA",
    description:
      "Montagem, instalação e ajuste de móveis planejados e estruturas sob medida.",
    image: "/images/drill.jpeg",
  },
  {
    id: "gesso",
    title: "GESSO E DRYWALL",
    description:
      "Forros, sancas e paredes em drywall com nivelamento e acabamento limpo.",
    image: "/images/drill.jpeg",
  },
  {
    id: "revestimentos",
    title: "REVESTIMENTOS",
    description:
      "Pisos, azulejos e porcelanatos assentados com alinhamento e rejunte impecável.",
    image: "/images/drill.jpeg",
  },
  {
    id: "manutencao",
    title: "MANUTENÇÃO PREDIAL",
    description:
      "Rotina preventiva e corretiva para manter prédios e comércios sempre em ordem.",
    image: "/images/drill.jpeg",
  },
];

export const SERVICES_MORE_CARD = {
  id: "mais-servicos",
  eyebrow: "E MAIS",
  title: "+10 SERVIÇOS",
  description:
    "Montagem, instalação, telhados, impermeabilização e o que mais sua obra precisar. Fale com a gente.",
  cta: "VER TODOS",
};

export const SERVICES_QUOTE_CTA_URL = "/orcamento";

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

// src/components/landingpage/hero/background-video/index.tsx
export const HERO_BACKGROUND_VIDEO_LEGACY_INLINE_ATTRS = {
  "webkit-playsinline": "true",
  "x5-playsinline": "true",
} as Record<string, string>;
