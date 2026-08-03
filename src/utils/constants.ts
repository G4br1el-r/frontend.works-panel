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
    id: 1,
    label: "eletrica",
    title: "ELÉTRICA",
    description:
      "Instalações, quadros, tomadas e correção de falhas com segurança e norma técnica.",
    image: "/images/solutions/electrical.jpeg",
    servicos: [
      "Instalação e troca de tomadas e interruptores",
      "Montagem e reforma de quadros de distribuição",
      "Instalação de disjuntores e dispositivos DR",
      "Passagem de fiação e infraestrutura elétrica",
      "Instalação de luminárias e pontos de iluminação",
      "Correção de curtos-circuitos e falhas intermitentes",
      "Instalação de chuveiro e ponto elétrico de alta carga",
      "Aterramento e proteção contra descargas elétricas",
      "Instalação de ventiladores de teto e exaustores",
      "Laudo e adequação elétrica às normas técnicas",
    ],
  },
  {
    id: 2,
    label: "alvenaria-e-obra",
    title: "ALVENARIA E OBRA",
    description:
      "Do reparo pontual à obra completa, com acabamento firme e prazo respeitado.",
    image: "/images/solutions/masonry.jpeg",
    servicos: [
      "Levantamento de paredes e muros",
      "Construção e reforma de fundações",
      "Reboco e chapisco de alvenaria",
      "Abertura e fechamento de vãos",
      "Construção de degraus e escadas",
      "Contrapiso e nivelamento de laje",
      "Demolição controlada de estruturas",
      "Construção de churrasqueiras e áreas externas",
      "Reforma estrutural e ampliação de cômodos",
      "Acompanhamento completo de obra do início ao fim",
    ],
  },
  {
    id: 3,
    label: "pintura",
    title: "PINTURA",
    description:
      "Preparo de superfície, massa e pintura interna ou externa com acabamento uniforme.",
    image: "/images/solutions/painting.jpeg",
    servicos: [
      "Pintura interna residencial e comercial",
      "Pintura externa e de fachadas",
      "Preparo de superfície e lixamento",
      "Aplicação de massa corrida e acrílica",
      "Textura e efeitos decorativos em parede",
      "Pintura de portões e estruturas metálicas",
      "Impermeabilização de fachadas com pintura",
      "Verniz e pintura em madeira",
      "Retoque e repintura pontual",
      "Consultoria de cores e acabamentos",
    ],
  },
  {
    id: 4,
    label: "hidraulica",
    title: "HIDRÁULICA",
    description:
      "Vazamentos, tubulações, louças e metais instalados e revisados sem retrabalho.",
    image: "/images/solutions/hydraulics.jpeg",
    servicos: [
      "Detecção e reparo de vazamentos",
      "Instalação e troca de tubulações",
      "Instalação de louças sanitárias",
      "Instalação de torneiras e metais",
      "Desentupimento de ralos e esgoto",
      "Instalação de caixa d'água e bombas",
      "Instalação de aquecedor e boiler",
      "Reparo de registros e válvulas",
      "Instalação de filtros e purificadores",
      "Revisão geral de sistema hidráulico",
    ],
  },
  {
    id: 5,
    label: "marcenaria",
    title: "MARCENARIA",
    description:
      "Montagem, instalação e ajuste de móveis planejados e estruturas sob medida.",
    image: "/images/solutions/woodworking.jpeg",
    servicos: [
      "Montagem de móveis planejados",
      "Instalação de armários e closets",
      "Fabricação de móveis sob medida",
      "Instalação de portas e batentes",
      "Ajuste e regulagem de dobradiças",
      "Instalação de prateleiras e nichos",
      "Reparo e restauração de móveis",
      "Instalação de rodapés e molduras",
      "Montagem de deck e estruturas em madeira",
      "Instalação de bancadas e balcões",
    ],
  },
  {
    id: 6,
    label: "gesso-e-drywall",
    title: "GESSO E DRYWALL",
    description:
      "Forros, sancas e paredes em drywall com nivelamento e acabamento limpo.",
    image: "/images/solutions/drywall.jpeg",
    servicos: [
      "Instalação de forro de gesso",
      "Construção de parede em drywall",
      "Sanca aberta e fechada com iluminação",
      "Instalação de rebaixo de teto",
      "Isolamento acústico com drywall",
      "Instalação de gesso 3D decorativo",
      "Reparo de trincas e recortes em drywall",
      "Instalação de forro modular removível",
      "Divisórias em drywall para ambientes",
      "Acabamento e pintura de gesso",
    ],
  },
  {
    id: 7,
    label: "revestimentos",
    title: "REVESTIMENTOS",
    description:
      "Pisos, azulejos e porcelanatos assentados com alinhamento e rejunte impecável.",
    image: "/images/solutions/coating.jpeg",
    servicos: [
      "Assentamento de piso porcelanato",
      "Instalação de azulejos e revestimentos de parede",
      "Assentamento de piso laminado e vinílico",
      "Rejuntamento e nivelamento de piso",
      "Instalação de rodapé e soleiras",
      "Revestimento de fachada em pastilha ou pedra",
      "Troca e reparo de pisos danificados",
      "Instalação de piso em área externa e antiderrapante",
      "Assentamento de mármore e granito",
      "Impermeabilização de área molhada antes do revestimento",
    ],
  },
  {
    id: 8,
    label: "manutencao-predial",
    title: "MANUTENÇÃO PREDIAL",
    description:
      "Rotina preventiva e corretiva para manter prédios e comércios sempre em ordem.",
    image: "/images/solutions/building-maintenance.jpeg",
    servicos: [
      "Manutenção preventiva periódica",
      "Reparos corretivos emergenciais",
      "Manutenção de áreas comuns e fachadas",
      "Inspeção e manutenção de telhados",
      "Manutenção de portões e sistemas automatizados",
      "Limpeza e manutenção de calhas e ralos",
      "Manutenção de sistemas elétricos e hidráulicos prediais",
      "Vistoria técnica e laudo de manutenção",
      "Manutenção de pintura e revestimentos externos",
      "Contrato de manutenção contínua para condomínios e empresas",
    ],
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

export const TESTIMONIALS_ITEMS = [
  {
    id: "marcos",
    quote:
      "A equipe superou nossas expectativas em todos os sentidos. Identificaram um vazamento que outros dois profissionais não conseguiram resolver, entregaram o serviço no prazo combinado e ainda deixaram tudo limpo e organizado. Já chamamos de novo para outros três projetos e voltaremos a chamar sempre que precisarmos.",
    name: "Marcos R.",
    role: "Síndico — Edifício Bela Vista",
  },
  {
    id: "jose",
    quote:
      "Resolveram um vazamento que outros dois profissionais não conseguiram identificar. Serviço rápido, limpo e com garantia por escrito. Recomendo de olhos fechados.",
    name: "José S.",
    role: "Morador — Bairro Jardim América",
  },
  {
    id: "carlos",
    quote:
      "A reforma completa do banheiro ficou pronta antes do prazo combinado. Acabamento impecável e equipe muito educada durante toda a obra, sem sujeira nem retrabalho.",
    name: "Carlos A.",
    role: "Proprietário — Residência Vila Nova",
  },
  {
    id: "patricia",
    quote:
      "Contratamos para trocar o quadro elétrico do escritório e o serviço foi rápido, seguro e sem burocracia. Explicaram cada etapa antes de começar e cumpriram o orçamento à risca.",
    name: "Patrícia M.",
    role: "Gerente Administrativa — Escritório Central",
  },
  {
    id: "roberto",
    quote:
      "Já são três obras com eles: pintura, drywall e agora revestimento. Sempre no prazo, sempre com o mesmo padrão de qualidade. Virou nosso fornecedor fixo de manutenção.",
    name: "Roberto F.",
    role: "Proprietário — Comércio Vila Rica",
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
  { id: "depoimentos", label: "DEPOIMENTOS", href: "#depoimentos" },
];

export const NOTCHED_BUTTON_CLIP_PATH =
  "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

export const NOTCHED_CARD_CLIP_PATH =
  "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))";

export const HERO_BACKGROUND_VIDEO_LEGACY_INLINE_ATTRS = {
  "webkit-playsinline": "true",
  "x5-playsinline": "true",
} as Record<string, string>;
