export default function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Linha Brasa",
        url: "https://linhabrasa.com.br",
        logo: "https://linhabrasa.com.br/images/logo.png",
        description:
          "Fabricante de caldeiras a lenha para aquecimento de piscinas em Londrina/PR.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Londrina",
          addressRegion: "PR",
          addressCountry: "BR",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+55-43-99999-9999",
          contactType: "sales",
        },
      },
      {
        "@type": "Product",
        name: "Caldeira a Lenha BRASA 60",
        description:
          "Caldeira a lenha para aquecimento de piscinas de até 40.000L. Economia de até 80% comparado ao gás. A mais vendida da linha.",
        brand: { "@type": "Brand", name: "Linha Brasa" },
        offers: {
          "@type": "Offer",
          price: "14500",
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          url: "https://linhabrasa.com.br/configurador",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          reviewCount: "47",
        },
      },
      {
        "@type": "VideoObject",
        name: "Linha Brasa — Caldeira a Lenha para Piscinas",
        description:
          "Veja como a caldeira a lenha Linha Brasa aquece sua piscina com economia de até 80% comparado ao gás.",
        thumbnailUrl: "https://linhabrasa.com.br/images/og-image.jpg",
        uploadDate: "2025-01-01",
        contentUrl: "https://linhabrasa.com.br/videos/hero-fire-pool.mp4",
        embedUrl: "https://linhabrasa.com.br",
        duration: "PT0M30S",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Quanto tempo leva para aquecer a piscina?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Em média, uma piscina de 40.000L sobe de 18°C para 28°C em 6 a 8 horas com a BRASA 60.",
            },
          },
          {
            "@type": "Question",
            name: "Qual o consumo de lenha por dia?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Para manutenção da temperatura, o consumo médio é de 8 a 15kg de lenha por dia, equivalente a R$ 3 a R$ 8 por dia.",
            },
          },
          {
            "@type": "Question",
            name: "Quanto economizo comparado ao aquecimento a gás?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Em média, a economia é de 60% a 80% comparado ao gás natural e até 90% comparado ao GLP.",
            },
          },
          {
            "@type": "Question",
            name: "A caldeira funciona com qualquer tipo de lenha?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim, funciona com qualquer lenha seca. Recomendamos eucalipto por ter melhor poder calorífico e ser mais acessível.",
            },
          },
          {
            "@type": "Question",
            name: "Precisa de instalação profissional?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Recomendamos instalação por profissional qualificado, mas o processo é simples. Oferecemos o serviço de instalação como aditivo opcional.",
            },
          },
          {
            "@type": "Question",
            name: "Qual a garantia do produto?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Todos os modelos possuem 2 anos de garantia de fábrica. Oferecemos garantia estendida para 5 anos como aditivo opcional.",
            },
          },
          {
            "@type": "Question",
            name: "A caldeira esquenta o ano todo, mesmo no inverno?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim! Diferente de aquecedores solares, funciona independente do clima. Mesmo em dias de 5°C, sua piscina estará na temperatura ideal.",
            },
          },
          {
            "@type": "Question",
            name: "Posso usar em piscina de vinil, fibra ou alvenaria?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim, nossas caldeiras são compatíveis com todos os tipos de piscina: vinil, fibra, alvenaria e concreto armado.",
            },
          },
          {
            "@type": "Question",
            name: "Funciona sem energia elétrica?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A caldeira em si funciona 100% sem energia elétrica — a combustão é natural. Porém, a bomba de circulação precisa de energia para movimentar a água.",
            },
          },
          {
            "@type": "Question",
            name: "Qual o prazo de entrega?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "O prazo médio de fabricação e entrega é de 15 a 25 dias úteis para a região Sul e Sudeste. Para demais regiões, consulte o prazo específico.",
            },
          },
          {
            "@type": "Question",
            name: "Como é feita a instalação?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A instalação envolve: posicionar a caldeira em base firme, conectar a tubulação de entrada e saída à filtragem da piscina, instalar a chaminé e fazer a queima de cura.",
            },
          },
          {
            "@type": "Question",
            name: "A piscina precisa ter casa de máquinas?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Não necessariamente. A caldeira pode ser instalada em área externa coberta, próxima à piscina. Recomendamos distância máxima de 15 metros para melhor eficiência.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
