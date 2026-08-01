import {
  BadgeCheck,
  Clock,
  Gem,
  Hammer,
  Handshake,
  HardHat,
  Home as HomeIcon,
  MapPin,
  ScrollText,
  Sparkles,
} from "lucide-react";

export const DESKTOP_BREAKPOINT_PX = 1024;

export const SITE_URL = "https://gui-goulart.vercel.app";
export const SITE_NAME = "Guilherme Goulart";
export const SITE_DEFAULT_TITLE = "Guilherme Goulart | Prestação de Serviços";
export const SITE_DEFAULT_DESCRIPTION =
  "Prestação de serviços com Guilherme Goulart. Solicite seu orçamento.";
export const SITE_CATEGORY = "construção civil";
export const SITE_KEYWORDS = [
  "prestação de serviços",
  "construção civil",
  "reformas residenciais",
  "reformas comerciais",
  "manutenção predial",
  "elétrica",
  "hidráulica",
  "alvenaria",
  "pintura",
  "marcenaria",
  "gesso e drywall",
  "revestimentos",
  "impermeabilização",
  "telhados",
  "orçamento de obra",
];
export const SITE_OG_IMAGE = "/images/brand/card.jpeg";
export const SITE_FAVICON = "/images/brand/card-favicon.ico";
export const SITE_HEADER_LOGO = "/images/brand/card-header.png";
export const SITE_APPLE_ICON = "/apple-touch-icon.png";
export const SITE_MANIFEST = "/site.webmanifest";

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

export const MARQUEE_SOLUTIONS = [
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

export const SOLUTIONS_ITEMS = [
  {
    id: "eletrica",
    title: "ELÉTRICA",
    description:
      "Instalações, quadros, tomadas e correção de falhas com segurança e norma técnica.",
    image: "/images/solutions/electrical.jpeg",
  },
  {
    id: "alvenaria",
    title: "ALVENARIA E OBRA",
    description:
      "Do reparo pontual à obra completa, com acabamento firme e prazo respeitado.",
    image: "/images/solutions/masonry.jpeg",
  },
  {
    id: "pintura",
    title: "PINTURA",
    description:
      "Preparo de superfície, massa e pintura interna ou externa com acabamento uniforme.",
    image: "/images/solutions/painting.jpeg",
  },
  {
    id: "hidraulica",
    title: "HIDRÁULICA",
    description:
      "Vazamentos, tubulações, louças e metais instalados e revisados sem retrabalho.",
    image: "/images/solutions/hydraulics.jpeg",
  },
  {
    id: "marcenaria",
    title: "MARCENARIA",
    description:
      "Montagem, instalação e ajuste de móveis planejados e estruturas sob medida.",
    image: "/images/solutions/woodworking.jpeg",
  },
  {
    id: "gesso",
    title: "GESSO E DRYWALL",
    description:
      "Forros, sancas e paredes em drywall com nivelamento e acabamento limpo.",
    image: "/images/solutions/drywall.jpeg",
  },
  {
    id: "revestimentos",
    title: "REVESTIMENTOS",
    description:
      "Pisos, azulejos e porcelanatos assentados com alinhamento e rejunte impecável.",
    image: "/images/solutions/coating.jpeg",
  },
  {
    id: "manutencao",
    title: "MANUTENÇÃO PREDIAL",
    description:
      "Rotina preventiva e corretiva para manter prédios e comércios sempre em ordem.",
    image: "/images/solutions/building-maintenance.jpeg",
  },
];

export const SOLUTIONS_MORE_CARD = {
  id: "mais-solucoes",
  eyebrow: "E MAIS",
  title: "+10 SERVIÇOS",
  description:
    "Montagem, instalação, telhados, impermeabilização e o que mais sua obra precisar. Fale com a gente.",
  cta: "VER TODOS",
  image: "/images/solutions/more-solutions.jpeg",
};

export const SOLUTIONS_QUOTE_CTA_URL = "/orcamento";

export const METRICS_BACKGROUND_VIDEO_SOURCES = [
  { src: "/videos/metrics-background.mp4", type: "video/mp4" },
];

export const METRICS_ANIMATION_DELAY = 3;

export const METRICS_COUNTER_DURATION = 2;

export const METRICS_ITEMS = [
  {
    id: "anos",
    icon: HardHat,
    value: 20,
    decimals: 0,
    prefix: "",
    suffix: "+",
    label: "ANOS DE MERCADO",
    description:
      "Duas décadas atendendo residências e empresas com trabalho entregue e reputação construída no boca a boca.",
  },
  {
    id: "resposta",
    icon: Clock,
    value: 24,
    decimals: 0,
    prefix: "",
    suffix: "h",
    label: "TEMPO DE RESPOSTA",
    description:
      "Orçamento respondido em até um dia útil, com atendimento de urgência para o que não pode esperar.",
  },
  {
    id: "satisfacao",
    icon: Sparkles,
    value: 98,
    decimals: 0,
    prefix: "",
    suffix: "%",
    label: "CLIENTES SATISFEITOS",
    description:
      "Avaliam o serviço como ótimo ou excelente e seguem chamando a equipe para os próximos projetos.",
  },
  {
    id: "projetos",
    icon: Hammer,
    value: 1.2,
    decimals: 1,
    prefix: "",
    suffix: "k",
    label: "SERVIÇOS ENTREGUES",
    description:
      "Do reparo pontual à obra completa, cada frente concluída com acabamento conferido item por item.",
  },
];

export const HERO_BRAND_WORDMARK_LETTERS = [
  { char: "G", id: "letter-1" },
  { char: "O", id: "letter-2" },
  { char: "U", id: "letter-3" },
  { char: "L", id: "letter-4" },
  { char: "A", id: "letter-5" },
  { char: "R", id: "letter-6" },
  { char: "T", id: "letter-7" },
];

export const HERO_QUOTE_CTA_URL = "/";

export const HEADER_NAV_ITEMS = [
  { id: "inicio", label: "HOME", href: "#inicio" },
  { id: "sobre", label: "QUEM SOMOS", href: "#sobre" },
  { id: "solucoes", label: "SERVIÇOS", href: "#solucoes" },
  { id: "diferenciais", label: "DIFERENCIAIS", href: "#diferenciais" },
  { id: "contato", label: "CONTATO", href: HERO_QUOTE_CTA_URL },
];

export const NOTCHED_BUTTON_CLIP_PATH =
  "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

export const NOTCHED_CARD_CLIP_PATH =
  "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))";

export const HERO_BACKGROUND_VIDEO_LEGACY_INLINE_ATTRS = {
  "webkit-playsinline": "true",
  "x5-playsinline": "true",
} as Record<string, string>;
