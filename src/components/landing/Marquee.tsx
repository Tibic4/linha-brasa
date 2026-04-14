"use client";

const items = [
  "🔥 Fabricação 100% Nacional",
  "⚡ Aquecimento em até 4h",
  "💰 Economia de até 80%",
  "🏆 Único no Brasil",
  "🛡️ 3 Anos de Garantia",
  "📦 Entrega para Todo Brasil",
  "🔧 Instalação Simples",
  "♻️ Energia Renovável",
];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <section className="py-4 bg-brasa-bg-light border-y border-brasa-border overflow-hidden">
      <div className="marquee-container">
        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="mx-8 font-mono text-sm text-brasa-gray tracking-wider"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
