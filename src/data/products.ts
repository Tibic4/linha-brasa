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
  emoji: string;
  description: string;
  badge?: string;
  price: number;
  models: string; // "todos" | "60,120,200" | "sul-sudeste"
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  price: number; // 0 = incluso
}

export const products: Product[] = [
  {
    id: "brasa-30",
    name: "BRASA 30",
    subtitle: "Compacta & Eficiente",
    poolSize: "Até 20.000L",
    power: "30.000 kcal/h",
    price: 9800,
    description:
      "Ideal para piscinas pequenas e spas. Aquecimento rápido com consumo mínimo de lenha. Perfeita para quem quer começar a economizar.",
    features: [
      "Corpo em aço carbono 4.75mm",
      "Serpentina em inox 304L de alta eficiência",
      "Porta com vedação hermética",
      "Pintura eletrostática resistente",
    ],
    gradient: "linear-gradient(135deg, #0A1628, #1A2A4A)",
    image: "/images/brasa-30.png",
  },
  {
    id: "brasa-60",
    name: "BRASA 60",
    subtitle: "A Mais Vendida",
    poolSize: "Até 40.000L",
    power: "60.000 kcal/h",
    price: 14500,
    description:
      "Nosso modelo mais vendido. Equilíbrio perfeito entre potência e economia para piscinas residenciais. Aquece 60.000L por R$ 84.",
    features: [
      "Corpo em aço carbono 4.75mm",
      "Serpentina dupla em inox 304L",
      "Sistema de tiragem otimizado",
      "Cinzeiro removível de fácil limpeza",
    ],
    gradient: "linear-gradient(135deg, #1A0F00, #3D2200)",
    image: "/images/brasa-60.png",
  },
  {
    id: "brasa-120",
    name: "BRASA 120",
    subtitle: "Potência Premium",
    poolSize: "Até 80.000L",
    power: "120.000 kcal/h",
    price: 21000,
    description:
      "Para piscinas maiores que exigem alto desempenho. Aquece rapidamente mesmo em dias frios. Ticket médio da linha BRASA.",
    features: [
      "Corpo reforçado em aço carbono 6.3mm",
      "Serpentina tripla em inox 304L",
      "Câmara de combustão ampliada",
      "Grelha em ferro fundido",
    ],
    gradient: "linear-gradient(135deg, #1A0800, #FF4F00)",
    image: "/images/brasa-120.png",
  },
  {
    id: "brasa-200",
    name: "BRASA 200",
    subtitle: "Industrial & Comercial",
    poolSize: "Até 150.000L",
    power: "200.000 kcal/h",
    price: 32000,
    description:
      "Potência máxima para piscinas comerciais, clubes e academias. Robustez incomparável. A solução definitiva para grandes volumes.",
    features: [
      "Corpo em aço carbono 6.3mm reforçado",
      "Serpentina quádrupla em inox 304L",
      "Sistema de combustão turbo",
      "Painel de controle de temperatura",
    ],
    gradient: "linear-gradient(135deg, #1A0000, #8B0000)",
    image: "/images/brasa-200.png",
  },
];

export const addons: Addon[] = [
  {
    id: "serpentina-316l",
    emoji: "🔥",
    name: "Serpentina Inox 316L",
    description: "Para piscinas salinizadas. Resistência superior à corrosão.",
    badge: "Ideal para piscina com sal",
    price: 680,
    models: "todos",
  },
  {
    id: "vidro-ceramico",
    emoji: "🪟",
    name: "Vidro Cerâmico Premium",
    description: "Janela maior 200×200mm Schott Robax. Visão plena do fogo.",
    badge: "Diferencial visual",
    price: 890,
    models: "todos",
  },
  {
    id: "bomba-dedicada",
    emoji: "⚡",
    name: "Bomba Dedicada 1CV",
    description: "Bomba exclusiva da caldeira. Não interfere na filtragem.",
    price: 1290,
    models: "todos",
  },
  {
    id: "chamine-estendida",
    emoji: "🏗️",
    name: "Chaminé Estendida +500mm",
    description: "Seção adicional para instalação próxima a paredes ou telhados.",
    price: 590,
    models: "todos",
  },
  {
    id: "cobertura-antigranizo",
    emoji: "⛈️",
    name: "Cobertura Antigranizo",
    description: "Estrutura alumínio + telha sanduíche. Proteção a céu aberto.",
    price: 780,
    models: "todos",
  },
  {
    id: "termostato-digital",
    emoji: "🌡️",
    name: "Termostato Digital com Display",
    description: "Controlador LCD com sonda PT100. Monitora entrada e saída.",
    price: 1190,
    models: "60,120,200",
  },
  {
    id: "kit-conexoes",
    emoji: "🔧",
    name: "Kit Conexões Hidráulicas",
    description: "Registros, adaptadores, tubos flex. Instalação plug-and-play.",
    price: 420,
    models: "todos",
  },
  {
    id: "grelha-inox",
    emoji: "⚙️",
    name: "Grelha Inox 316L",
    description: "Substituição da grelha de ferro fundido. Maior durabilidade.",
    price: 680,
    models: "todos",
  },
  {
    id: "instalacao-comissionamento",
    emoji: "🛠️",
    name: "Instalação + Comissionamento",
    description: "Visita técnica, teste hidráulico, queima de cura, treinamento.",
    price: 1800,
    models: "sul-sudeste",
  },
  {
    id: "garantia-estendida",
    emoji: "🛡️",
    name: "Garantia Estendida 5 anos",
    description: "Estende de 2 para 5 anos. Cobre serpentina e estrutura.",
    price: 1500,
    models: "todos",
  },
  {
    id: "embalagem-longa-distancia",
    emoji: "📦",
    name: "Embalagem Transporte Longa Distância",
    description: "Caixote madeira + espuma para Norte/Nordeste ou exportação.",
    price: 380,
    models: "todos",
  },
];

export const productColors: ProductColor[] = [
  { id: "preto-satin", name: "Preto Satin", hex: "#1A1A1A", price: 0 },
  { id: "cinza-grafite", name: "Cinza Grafite", hex: "#4A4A4A", price: 480 },
  { id: "verde-militar", name: "Verde Militar", hex: "#4A5D3A", price: 480 },
  { id: "bege-rustico", name: "Bege Rústico", hex: "#C4A77D", price: 480 },
  { id: "bronze", name: "Bronze", hex: "#8B6914", price: 680 },
  { id: "inox-escovado", name: "Inox Escovado", hex: "#C0C0C0", price: 980 },
];

// Keep old colors export for backwards compat
export const colors = productColors;

export const testimonials = [
  {
    id: 1,
    name: "Ricardo M.",
    location: "Curitiba, PR",
    rating: 5,
    text: "Economizo mais de R$ 400/mês comparado ao aquecimento a gás. Em 6 meses a caldeira já se pagou.",
    image: "/images/testimonials/ricardo.jpg",
    model: "brasa-60",
    poolSize: "35.000L",
    result: "Aqueci em 8h por R$ 76",
  },
  {
    id: 2,
    name: "Fernanda S.",
    location: "Campinas, SP",
    rating: 5,
    text: "A piscina fica na temperatura perfeita mesmo no inverno. Meus filhos adoram! Recomendo demais.",
    image: "/images/testimonials/fernanda.jpg",
    model: "brasa-30",
    poolSize: "18.000L",
    result: "Aqueceu em 4h por R$ 42",
  },
  {
    id: 3,
    name: "Carlos A.",
    location: "Florianópolis, SC",
    rating: 5,
    text: "Produto robusto, acabamento impecável. A equipe da Linha Brasa deu todo suporte na instalação.",
    image: "/images/testimonials/carlos.jpg",
    model: "brasa-120",
    poolSize: "60.000L",
    result: "Aqueceu em 11h por R$ 84",
  },
  {
    id: 4,
    name: "Mariana L.",
    location: "Londrina, PR",
    rating: 5,
    text: "Tinha receio de caldeira a lenha, mas a praticidade me surpreendeu. Acendo e em 2h a piscina está quente.",
    image: "/images/testimonials/mariana.jpg",
    model: "brasa-60",
    poolSize: "25.000L",
    result: "Aqueceu em 5h por R$ 58",
  },
  {
    id: 5,
    name: "João P.",
    location: "Porto Alegre, RS",
    rating: 5,
    text: "Tenho uma academia com piscina e a BRASA 200 dá conta perfeita. Economia absurda no gás.",
    image: "/images/testimonials/joao.jpg",
    model: "brasa-200",
    poolSize: "120.000L",
    result: "Economizo R$ 2.800/mês vs GLP",
  },
];

export const faqItems = [
  {
    question: "Quanto tempo leva para aquecer a piscina?",
    answer:
      "Depende do volume da piscina e da temperatura inicial. Em média, uma piscina de 40.000L sobe de 18°C para 28°C em 6 a 8 horas com a BRASA 60. Depois de aquecida, a manutenção da temperatura consome muito menos lenha.",
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
      "Recomendamos instalação por profissional qualificado, mas o processo é simples: conexão na tubulação da piscina, posicionamento da caldeira e instalação da chaminé. Oferecemos o serviço de instalação + comissionamento como aditivo opcional (Sul/Sudeste).",
  },
  {
    question: "Qual a garantia do produto?",
    answer:
      "Todos os modelos possuem 2 anos de garantia de fábrica contra defeitos de fabricação. Oferecemos garantia estendida para 5 anos (cobre serpentina e estrutura) como aditivo opcional.",
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
      "Em média, a economia é de 60% a 80% comparado ao gás natural e até 90% comparado ao GLP (gás de botijão). Uma piscina de 60.000L custa apenas R$ 84 para aquecer com lenha. Use nossa calculadora de economia para ver o valor exato para sua piscina.",
  },
  {
    question: "Funciona sem energia elétrica?",
    answer:
      "A caldeira em si funciona 100% sem energia elétrica — a combustão é natural. Porém, a bomba de circulação (que movimenta a água) precisa de energia. Isso significa que em caso de queda de luz, a caldeira mantém o calor, mas a circulação para até a energia voltar.",
  },
  {
    question: "Qual o prazo de entrega?",
    answer:
      "O prazo médio de fabricação e entrega é de 15 a 25 dias úteis para a região Sul e Sudeste. Para demais regiões, consulte o prazo específico. Fabricamos sob demanda em Londrina/PR.",
  },
  {
    question: "Como é feita a instalação?",
    answer:
      "A instalação envolve: posicionar a caldeira em base firme, conectar a tubulação de entrada e saída à filtragem da piscina, instalar a chaminé e fazer a queima de cura. Oferecemos serviço completo de instalação + comissionamento para Sul/Sudeste.",
  },
  {
    question: "A piscina precisa ter casa de máquinas?",
    answer:
      "Não necessariamente. A caldeira pode ser instalada em área externa coberta, próxima à piscina. Recomendamos distância máxima de 15 metros da piscina para melhor eficiência. Oferecemos cobertura antigranizo como aditivo para instalações a céu aberto.",
  },
];
