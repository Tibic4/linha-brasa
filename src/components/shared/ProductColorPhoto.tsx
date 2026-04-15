"use client";

import Image from "next/image";

/**
 * Two-layer photo color system:
 * Layer 1 (bottom): Original photo — fire, pipes, everything untouched
 * Layer 2 (top): Same photo with CSS color filter, CLIPPED to boiler body only
 *
 * Result: only the caldeira body changes color. Fire stays orange, pipes stay gray.
 */

interface ProductColorPhotoProps {
  model: "brasa-15" | "brasa-25" | "brasa-35" | "brasa-50";
  colorHex: string;
  colorId: string;
  className?: string;
}

// Clip-path polygons that cover ONLY the boiler body area for each model.
// Adjust these percentages after seeing the actual product photos.
// Format: polygon(x% y%, x% y%, ...) — clockwise from top-left of body.
const bodyClipPaths: Record<string, string> = {
  "brasa-15": "polygon(20% 10%, 80% 10%, 82% 15%, 82% 75%, 78% 80%, 22% 80%, 18% 75%, 18% 15%)",
  "brasa-25": "polygon(18% 8%, 82% 8%, 84% 14%, 84% 76%, 80% 82%, 20% 82%, 16% 76%, 16% 14%)",
  "brasa-35": "polygon(16% 6%, 84% 6%, 86% 12%, 86% 78%, 82% 84%, 18% 84%, 14% 78%, 14% 12%)",
  "brasa-50": "polygon(14% 5%, 86% 5%, 88% 11%, 88% 78%, 84% 84%, 16% 84%, 12% 78%, 12% 11%)",
};

// Color filters calibrated per color — only applied to the clipped body layer
const colorFilters: Record<string, string> = {
  "preto-fosco":   "brightness(0.5) saturate(0.2)",
  "cinza-grafite": "brightness(0.8) saturate(0.25) contrast(1.1)",
  "terracota":     "sepia(0.8) saturate(2.5) hue-rotate(-10deg) brightness(0.85)",
  "verde-musgo":   "sepia(0.7) saturate(2) hue-rotate(70deg) brightness(0.8)",
  "azul-petroleo": "sepia(0.7) saturate(2.5) hue-rotate(170deg) brightness(0.8)",
  "branco-gelo":   "brightness(1.5) saturate(0.1) contrast(0.8)",
};

export default function ProductColorPhoto({ model, colorHex, colorId, className = "" }: ProductColorPhotoProps) {
  const clipPath = bodyClipPaths[model] || bodyClipPaths["brasa-25"];
  const filter = colorFilters[colorId] || "none";
  const isDefault = colorId === "preto-fosco";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Layer 1: Original photo — everything untouched */}
      <Image
        src={`/images/${model}.png`}
        alt={`Caldeira ${model.toUpperCase()}`}
        width={400}
        height={500}
        className="object-contain w-full h-full relative z-0"
      />

      {/* Layer 2: Same photo with color filter, clipped to body area only */}
      {!isDefault && (
        <div
          className="absolute inset-0 z-10 transition-all duration-700"
          style={{ clipPath }}
        >
          <Image
            src={`/images/${model}.png`}
            alt=""
            width={400}
            height={500}
            className="object-contain w-full h-full"
            style={{
              filter,
              transition: "filter 0.7s ease",
            }}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Layer 3: Subtle color tint glow on body area for extra pop */}
      {!isDefault && (
        <div
          className="absolute inset-0 z-20 pointer-events-none transition-all duration-700"
          style={{
            clipPath,
            background: `radial-gradient(ellipse at 50% 50%, ${colorHex}30 0%, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
}
