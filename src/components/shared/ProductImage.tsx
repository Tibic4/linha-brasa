"use client";

import Image from "next/image";

/**
 * Product image component — model ID maps directly to filename.
 * e.g. "brasa-60" → /images/brasa-60.png
 */

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
  const src = `/images/${model}.png`;

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
