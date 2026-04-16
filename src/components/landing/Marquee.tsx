"use client";

const items = [
  "✓ Garantia 2 anos",
  "✓ Inox 304L",
  "✓ Teste hidráulico 8 bar",
  "✓ Fabricação Londrina/PR",
  "✓ +200 piscinas aquecidas",
  "💰 Economia de até 80%",
  "🏆 Produto único no Brasil",
  "♻️ Energia 100% renovável",
];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <section className="py-4 bg-brasa-bg-light border-y border-brasa-border overflow-hidden group">
      <div className="marquee-container">
        <div className="flex animate-marquee sm:animate-marquee-desktop whitespace-nowrap group-hover:[animation-play-state:paused]">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="mx-6 sm:mx-8 font-mono text-xs sm:text-sm text-brasa-gray tracking-wider"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
