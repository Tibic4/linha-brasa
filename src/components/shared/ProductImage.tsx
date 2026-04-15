"use client";

import Image from "next/image";

/**
 * Product image component — uses real photos when available,
 * falls back to SVG placeholders.
 */

interface ProductImageProps {
  model: "brasa-15" | "brasa-25" | "brasa-35" | "brasa-50";
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

  return (
    <Image
      src={`/images/${model}.png`}
      alt={`Caldeira a lenha ${model.toUpperCase()}`}
      width={width}
      height={height}
      className={`object-contain ${className}`}
      style={colorFilter ? { filter: colorFilter, transition: "filter 0.7s ease" } : undefined}
      priority={size === "lg"}
    />
  );
}
