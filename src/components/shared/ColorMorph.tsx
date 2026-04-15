"use client";

import { motion } from "framer-motion";

/**
 * COLOR MORPHING — Técnica Ice Cream Fluid
 *
 * Cada modelo tem um "color profile" com 3 blobs em posições e cores únicas.
 * 30=azul escuro, 60=âmbar dourado, 120=laranja fogo, 200=brasa vermelha
 */

interface ColorProfile {
  blob1: { x: string; y: string; color: string; scale: number; opacity: number };
  blob2: { x: string; y: string; color: string; scale: number; opacity: number };
  blob3: { x: string; y: string; color: string; scale: number; opacity: number };
}

const modelProfiles: ColorProfile[] = [
  // BRASA 30 — Azul escuro frio (entrada, compacta)
  {
    blob1: { x: "30%", y: "60%", color: "#1B3A5C", scale: 1, opacity: 0.25 },
    blob2: { x: "70%", y: "40%", color: "#2B5D8C", scale: 0.8, opacity: 0.15 },
    blob3: { x: "50%", y: "80%", color: "#0D2B45", scale: 0.6, opacity: 0.1 },
  },
  // BRASA 60 — Âmbar dourado (mais vendida)
  {
    blob1: { x: "50%", y: "50%", color: "#CC8400", scale: 1.3, opacity: 0.3 },
    blob2: { x: "25%", y: "70%", color: "#FFD166", scale: 1, opacity: 0.2 },
    blob3: { x: "75%", y: "30%", color: "#E6A800", scale: 0.7, opacity: 0.15 },
  },
  // BRASA 120 — Laranja fogo (premium)
  {
    blob1: { x: "60%", y: "55%", color: "#FF4F00", scale: 1.1, opacity: 0.28 },
    blob2: { x: "30%", y: "35%", color: "#FF7043", scale: 0.9, opacity: 0.18 },
    blob3: { x: "70%", y: "75%", color: "#FF8C42", scale: 0.8, opacity: 0.12 },
  },
  // BRASA 200 — Brasa vermelha profunda (poder máximo)
  {
    blob1: { x: "45%", y: "65%", color: "#BF360C", scale: 1.2, opacity: 0.3 },
    blob2: { x: "65%", y: "30%", color: "#D84315", scale: 1, opacity: 0.22 },
    blob3: { x: "20%", y: "50%", color: "#8B1A04", scale: 0.9, opacity: 0.15 },
  },
];

const blobTransition = {
  duration: 1.4,
  ease: [0.4, 0, 0.2, 1] as const,
};

interface ColorMorphProps {
  activeModel: number;
  variant?: "hero" | "page";
  className?: string;
}

export default function ColorMorph({
  activeModel,
  variant = "hero",
  className = "",
}: ColorMorphProps) {
  const profile = modelProfiles[activeModel] || modelProfiles[0];
  const isHero = variant === "hero";
  const blurAmount = isHero ? "120px" : "100px";
  const baseSize = isHero ? "clamp(300px, 50vw, 700px)" : "clamp(250px, 40vw, 500px)";
  const opacityMultiplier = isHero ? 1 : 0.6;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <motion.div
        className="absolute rounded-full"
        animate={{
          left: profile.blob1.x,
          top: profile.blob1.y,
          backgroundColor: profile.blob1.color,
          scale: profile.blob1.scale,
          opacity: profile.blob1.opacity * opacityMultiplier,
        }}
        transition={blobTransition}
        style={{
          width: baseSize,
          height: baseSize,
          filter: `blur(${blurAmount})`,
          transform: "translate(-50%, -50%)",
          willChange: "left, top, background-color, opacity, transform",
        }}
      />
      <motion.div
        className="absolute rounded-full"
        animate={{
          left: profile.blob2.x,
          top: profile.blob2.y,
          backgroundColor: profile.blob2.color,
          scale: profile.blob2.scale,
          opacity: profile.blob2.opacity * opacityMultiplier,
        }}
        transition={{ ...blobTransition, duration: 1.8 }}
        style={{
          width: baseSize,
          height: baseSize,
          filter: `blur(${blurAmount})`,
          transform: "translate(-50%, -50%)",
          willChange: "left, top, background-color, opacity, transform",
        }}
      />
      <motion.div
        className="absolute rounded-full"
        animate={{
          left: profile.blob3.x,
          top: profile.blob3.y,
          backgroundColor: profile.blob3.color,
          scale: profile.blob3.scale,
          opacity: profile.blob3.opacity * opacityMultiplier,
        }}
        transition={{ ...blobTransition, duration: 2.0 }}
        style={{
          width: `calc(${baseSize} * 0.7)`,
          height: `calc(${baseSize} * 0.7)`,
          filter: `blur(${blurAmount})`,
          transform: "translate(-50%, -50%)",
          willChange: "left, top, background-color, opacity, transform",
        }}
      />
    </div>
  );
}
