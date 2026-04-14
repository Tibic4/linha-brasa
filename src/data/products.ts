export interface Product {
  id: string;
  name: string;
  subtitle: string;
  poolSize: string;
  power: string;
  price: number;
  description: string;
  features: string[];
  gradient: string;
  image: string;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const products: Product[] = [
  {
    id: "brasa-15",
    name: "BRASA 15",
    subtitle: "Compacta & Eficiente",
    poolSize: "Até 15.000L",
    power: "15.000 kcal/h",
    price: 11500,
    description:
      "Ideal para piscinas pequenas e spas. Aquecimento rápido com consumo mínimo de lenha.",
    features: [
      "Corpo em aço carbono 4.75mm",
      "Serpentina em cobre de alta eficiência",
      "Porta com vedação hermética",
      "Pintura eletrostática resistente",
    ],
    gradient: "linear-gradient(135deg, #FF4F00 0%, #FF8C42 100%)",
    image: "/images/brasa-15.png",
  },
  {
    id: "brasa-25",
    name: "BRASA 25",
    subtitle: "A Mais Vendida",
    poolSize: "Até 25.000L",
    power: "25.000 kcal/h",
    price: 13500,
    description:
      "Nosso modelo mais vendido. Equilíbrio perfeito entre potência e economia para piscinas residenciais.",
    features: [
      "Corpo em aço carbono 4.75mm",
      "Serpentina dupla em cobre",
      "Sistema de tiragem otimizado",
      "Cinzeiro removível",
    ],
    gradient: "linear-gradient(135deg, #FF6B00 0%, #FFD166 100%)",
    image: "/images/brasa-25.png",
  },
  {
    id: "brasa-35",
    name: "BRASA 35",
    subtitle: "Potência Premium",
    poolSize: "Até 35.000L",
    power: "35.000 kcal/h",
    price: 15500,
    description:
      "Para piscinas maiores que exigem alto desempenho. Aquece rapidamente mesmo em dias frios.",
    features: [
      "Corpo reforçado em aço carbono 6.3mm",
      "Serpentina tripla em cobre",
      "Câmara de combustão ampliada",
      "Grelha em ferro fundido",
    ],
    gradient: "linear-gradient(135deg, #FF3D00 0%, #FF7043 100%)",
    image: "/images/brasa-35.png",
  },
  {
    id: "brasa-50",
    name: "BRASA 50",
    subtitle: "Industrial & Comercial",
    poolSize: "Até 50.000L",
    power: "50.000 kcal/h",
    price: 17500,
    description:
      "Potência máxima para piscinas comerciais, clubes e academias. Robustez incomparável.",
    features: [
      "Corpo em aço carbono 6.3mm reforçado",
      "Serpentina quádrupla em cobre",
      "Sistema de combustão turbo",
      "Painel de controle de temperatura",
    ],
    gradient: "linear-gradient(135deg, #BF360C 0%, #FF4F00 100%)",
    image: "/images/brasa-50.png",
  },
];

export const addons: Addon[] = [
  {
    id: "capa-termica",
    name: "Capa Térmica",
    description: "Reduz a perda de calor em até 75%",
    price: 890,
    image: "/images/addons/capa-termica.png",
  },
  {
    id: "termometro-digital",
    name: "Termômetro Digital",
    description: "Monitore a temperatura em tempo real",
    price: 290,
    image: "/images/addons/termometro.png",
  },
  {
    id: "kit-instalacao",
    name: "Kit Instalação",
    description: "Tubulação, conexões e abraçadeiras inclusos",
    price: 650,
    image: "/images/addons/kit-instalacao.png",
  },
  {
    id: "bomba-recirculacao",
    name: "Bomba de Recirculação",
    description: "Bomba 1/2cv para circulação forçada",
    price: 1290,
    image: "/images/addons/bomba.png",
  },
  {
    id: "chamine-inox",
    name: "Chaminé Inox 3m",
    description: "Chaminé em aço inox 304 com chapéu",
    price: 790,
    image: "/images/addons/chamine.png",
  },
  {
    id: "base-concreto",
    name: "Base de Concreto",
    description: "Base pré-moldada para instalação",
    price: 450,
    image: "/images/addons/base.png",
  },
  {
    id: "controlador-temp",
    name: "Controlador de Temperatura",
    description: "Automação com liga/desliga por temperatura",
    price: 890,
    image: "/images/addons/controlador.png",
  },
  {
    id: "trocador-calor",
    name: "Trocador de Calor",
    description: "Aumenta eficiência em até 30%",
    price: 1490,
    image: "/images/addons/trocador.png",
  },
  {
    id: "lenha-eucalipto",
    name: "Lenha de Eucalipto (1m³)",
    description: "Lenha seca pronta para uso",
    price: 280,
    image: "/images/addons/lenha.png",
  },
  {
    id: "suporte-lenha",
    name: "Suporte para Lenha",
    description: "Rack em aço para armazenamento",
    price: 390,
    image: "/images/addons/suporte.png",
  },
  {
    id: "garantia-estendida",
    name: "Garantia Estendida +2 anos",
    description: "Extensão de garantia total para 5 anos",
    price: 990,
    image: "/images/addons/garantia.png",
  },
  {
    id: "instalacao-profissional",
    name: "Instalação Profissional",
    description: "Instalação por técnico certificado",
    price: 1200,
    image: "/images/addons/instalacao.png",
  },
];

export const colors = [
  { id: "preto-fosco", name: "Preto Fosco", hex: "#1A1A1A", image: "/images/colors/preto.png" },
  { id: "cinza-grafite", name: "Cinza Grafite", hex: "#4A4A4A", image: "/images/colors/grafite.png" },
  { id: "terracota", name: "Terracota", hex: "#C75B39", image: "/images/colors/terracota.png" },
  { id: "verde-musgo", name: "Verde Musgo", hex: "#4A5D3A", image: "/images/colors/verde.png" },
  { id: "azul-petroleo", name: "Azul Petróleo", hex: "#1B4F72", image: "/images/colors/azul.png" },
  { id: "branco-gelo", name: "Branco Gelo", hex: "#E8E8E8", image: "/images/colors/branco.png" },
];

export const testimonials = [
  {
    id: 1,
    name: "Ricardo M.",
    location: "Curitiba, PR",
    rating: 5,
    text: "Economizo mais de R$ 400/mês comparado ao aquecimento a gás. Em 6 meses a caldeira já se pagou.",
    image: "/images/testimonials/ricardo.jpg",
  },
  {
    id: 2,
    name: "Fernanda S.",
    location: "Campinas, SP",
    rating: 5,
    text: "A piscina fica na temperatura perfeita mesmo no inverno. Meus filhos adoram! Recomendo demais.",
    image: "/images/testimonials/fernanda.jpg",
  },
  {
    id: 3,
    name: "Carlos A.",
    location: "Florianópolis, SC",
    rating: 5,
    text: "Produto robusto, acabamento impecável. A equipe da Linha Brasa deu todo suporte na instalação.",
    image: "/images/testimonials/carlos.jpg",
  },
  {
    id: 4,
    name: "Mariana L.",
    location: "Londrina, PR",
    rating: 5,
    text: "Tinha receio de caldeira a lenha, mas a praticidade me surpreendeu. Acendo e em 2h a piscina está quente.",
    image: "/images/testimonials/mariana.jpg",
  },
  {
    id: 5,
    name: "João P.",
    location: "Porto Alegre, RS",
    rating: 5,
    text: "Tenho uma academia com piscina e a BRASA 50 dá conta perfeita. Economia absurda no gás.",
    image: "/images/testimonials/joao.jpg",
  },
];

export const faqItems = [
  {
    question: "Quanto tempo leva para aquecer a piscina?",
    answer:
      "Depende do volume da piscina e da temperatura inicial. Em média, uma piscina de 20.000L sobe de 18°C para 28°C em 4 a 6 horas com a BRASA 25. Depois de aquecida, a manutenção da temperatura consome muito menos lenha.",
  },
  {
    question: "Qual o consumo de lenha por dia?",
    answer:
      "Para manutenção da temperatura (após o primeiro aquecimento), o consumo médio é de 8 a 15kg de lenha por dia, dependendo do modelo e das condições climáticas. Isso equivale a aproximadamente R$ 3 a R$ 8 por dia.",
  },
  {
    question: "A caldeira funciona com qualquer tipo de lenha?",
    answer:
      "Sim, funciona com qualquer lenha seca. Recomendamos eucalipto por ter melhor poder calorífico e ser mais acessível. Evite lenha verde (úmida), pois reduz a eficiência e gera mais fumaça.",
  },
  {
    question: "Precisa de instalação profissional?",
    answer:
      "Recomendamos instalação por profissional qualificado, mas o processo é simples: conexão na tubulação da piscina, posicionamento da caldeira e instalação da chaminé. Oferecemos o serviço de instalação como aditivo opcional.",
  },
  {
    question: "Qual a garantia do produto?",
    answer:
      "Todos os modelos possuem 3 anos de garantia de fábrica contra defeitos de fabricação. Oferecemos garantia estendida de +2 anos (total 5 anos) como aditivo opcional.",
  },
  {
    question: "A caldeira esquenta o ano todo, mesmo no inverno?",
    answer:
      "Sim! A caldeira a lenha é o método mais eficiente para aquecer piscinas no inverno. Diferente de aquecedores solares, funciona independente do clima. Mesmo em dias de 5°C, sua piscina estará na temperatura ideal.",
  },
  {
    question: "Posso usar em piscina de vinil, fibra ou alvenaria?",
    answer:
      "Sim, nossas caldeiras são compatíveis com todos os tipos de piscina: vinil, fibra, alvenaria e até piscinas de concreto armado. A instalação se adapta ao sistema de filtragem existente.",
  },
  {
    question: "Quanto economizo comparado ao aquecimento a gás?",
    answer:
      "Em média, a economia é de 60% a 80% comparado ao gás natural e até 90% comparado ao GLP (gás de botijão). Use nossa calculadora de economia para ver o valor exato para sua piscina.",
  },
];
