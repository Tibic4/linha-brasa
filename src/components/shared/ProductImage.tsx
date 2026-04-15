"use client";

import Image from "next/image";

/**
 * Product image component — maps model IDs to available image files.
 * New model IDs (brasa-30/60/120/200) map to existing photos.
 */

// Map new model IDs to existing image files
const imageMap: Record<string, string> = {
  "brasa-30": "/images/brasa-15.png",
  "brasa-60": "/images/brasa-25.png",
  "brasa-120": "/images/brasa-35.png",
  "brasa-200": "/images/brasa-50.png",
  // Keep old IDs working
  "brasa-15": "/images/brasa-15.png",
  "brasa-25": "/images/brasa-25.png",
  "brasa-35": "/images/brasa-35.png",
  "brasa-50": "/images/brasa-50.png",
};

interface ProductImageProps {
  model: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  colorFilter?: string;
}

export default function ProductImage({ model, className = "", size = "md", colorFilter }: ProductImageProps) {
  const sizes = {
    sm: { width: 200, height: 250 },
    md: { width: 400, height: 500 },
    lg: { width: 600, height: 750 },
  };

  const { width, height } = sizes[size];
  const src = imageMap[model] || `/images/${model}.png`;

  return (
    <Image
      src={src}
      alt={`Caldeira a lenha ${model.toUpperCase()}`}
      width={width}
      height={height}
      className={`object-contain ${className}`}
      style={colorFilter ? { filter: colorFilter, transition: "filter 0.7s ease" } : undefined}
      priority={size === "lg"}
    />
  );
}
