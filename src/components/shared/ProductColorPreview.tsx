"use client";

import { motion } from "framer-motion";

/**
 * SVG product illustration with dynamic color on the boiler body ONLY.
 * Pipes stay gray, fire stays orange — only the caldeira shell changes color.
 */

interface ProductColorPreviewProps {
  colorHex: string;
  modelName: string;
  className?: string;
}

export default function ProductColorPreview({ colorHex, modelName, className = "" }: ProductColorPreviewProps) {
  // Derive darker/lighter variants from the hex for shading
  const darken = (hex: string, amount: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
    const b = Math.max(0, (num & 0x0000ff) - amount);
    return `rgb(${r},${g},${b})`;
  };

  const lighten = (hex: string, amount: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
    const b = Math.min(255, (num & 0x0000ff) + amount);
    return `rgb(${r},${g},${b})`;
  };

  const bodyColor = colorHex;
  const bodyDark = darken(colorHex, 40);
  const bodyLight = lighten(colorHex, 30);
  const bodyHighlight = lighten(colorHex, 60);

  // Scale factor based on model
  const scaleMap: Record<string, number> = {
    "BRASA 30": 0.8,
    "BRASA 60": 0.88,
    "BRASA 120": 0.95,
    "BRASA 200": 1,
  };
  const scale = scaleMap[modelName] || 0.9;

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 280 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ transform: `scale(${scale})` }}
      >
        <defs>
          {/* Body gradient — dynamic color */}
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0.5">
            <motion.stop offset="0%" animate={{ stopColor: bodyLight }} transition={{ duration: 0.6 }} />
            <motion.stop offset="40%" animate={{ stopColor: bodyColor }} transition={{ duration: 0.6 }} />
            <motion.stop offset="100%" animate={{ stopColor: bodyDark }} transition={{ duration: 0.6 }} />
          </linearGradient>

          {/* Side shading gradient */}
          <linearGradient id="sideGrad" x1="0" y1="0" x2="1" y2="0">
            <motion.stop offset="0%" animate={{ stopColor: bodyDark }} transition={{ duration: 0.6 }} />
            <motion.stop offset="50%" animate={{ stopColor: bodyColor }} transition={{ duration: 0.6 }} />
            <motion.stop offset="100%" animate={{ stopColor: darken(colorHex, 60) }} transition={{ duration: 0.6 }} />
          </linearGradient>

          {/* Metallic highlight */}
          <linearGradient id="highlightGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.03)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
          </linearGradient>

          {/* Fire glow */}
          <radialGradient id="fireGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FF4F00" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#FF6B20" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FF4F00" stopOpacity="0" />
          </radialGradient>

          {/* Subtle reflection */}
          <linearGradient id="reflection" x1="0" y1="0" x2="0" y2="1">
            <motion.stop offset="0%" animate={{ stopColor: bodyHighlight }} transition={{ duration: 0.6 }} stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ========== SHADOW ========== */}
        <ellipse cx="140" cy="305" rx="65" ry="8" fill="rgba(0,0,0,0.3)" />

        {/* ========== LEGS / BASE — fixed dark gray ========== */}
        <rect x="85" y="270" width="8" height="35" rx="2" fill="#3A3A3A" />
        <rect x="187" y="270" width="8" height="35" rx="2" fill="#3A3A3A" />
        <rect x="80" y="296" width="18" height="4" rx="2" fill="#2A2A2A" />
        <rect x="182" y="296" width="18" height="4" rx="2" fill="#2A2A2A" />

        {/* ========== CALDEIRA BODY — DYNAMIC COLOR ========== */}
        {/* Main cylinder body */}
        <motion.rect
          x="75" y="90" width="130" height="185" rx="8"
          fill="url(#bodyGrad)"
          transition={{ duration: 0.6 }}
        />

        {/* Metallic highlight overlay */}
        <rect x="75" y="90" width="130" height="185" rx="8" fill="url(#highlightGrad)" />

        {/* Left edge shading */}
        <motion.rect
          x="75" y="90" width="15" height="185" rx="4"
          animate={{ fill: darken(colorHex, 50) }}
          transition={{ duration: 0.6 }}
          opacity="0.5"
        />

        {/* Right edge shading */}
        <motion.rect
          x="190" y="90" width="15" height="185" rx="4"
          animate={{ fill: darken(colorHex, 70) }}
          transition={{ duration: 0.6 }}
          opacity="0.4"
        />

        {/* Reflection strip */}
        <rect x="95" y="95" width="6" height="170" rx="3" fill="url(#reflection)" opacity="0.5" />

        {/* Horizontal detail lines on body */}
        <motion.line x1="80" y1="130" x2="200" y2="130" animate={{ stroke: darken(colorHex, 30) }} strokeWidth="1" opacity="0.4" transition={{ duration: 0.6 }} />
        <motion.line x1="80" y1="200" x2="200" y2="200" animate={{ stroke: darken(colorHex, 30) }} strokeWidth="1" opacity="0.4" transition={{ duration: 0.6 }} />

        {/* ========== TOP LID — DYNAMIC COLOR (darker) ========== */}
        <motion.ellipse
          cx="140" cy="90" rx="65" ry="14"
          animate={{ fill: bodyDark }}
          transition={{ duration: 0.6 }}
        />
        <motion.ellipse
          cx="140" cy="90" rx="55" ry="10"
          animate={{ fill: bodyColor }}
          transition={{ duration: 0.6 }}
          opacity="0.5"
        />

        {/* ========== FIRE CHAMBER — FIXED ORANGE ========== */}
        {/* Fire opening */}
        <rect x="100" y="230" width="80" height="40" rx="6" fill="#1A1A1A" />
        <rect x="104" y="234" width="72" height="32" rx="4" fill="#0D0D0D" />

        {/* Fire glow inside */}
        <ellipse cx="140" cy="250" rx="30" ry="14" fill="url(#fireGlow)" />

        {/* Fire flames — always orange */}
        <motion.path
          d="M125 255 Q128 240 132 248 Q135 238 140 250 Q145 236 148 248 Q152 240 155 255"
          fill="none" stroke="#FF6B20" strokeWidth="2.5" strokeLinecap="round"
          animate={{ d: [
            "M125 255 Q128 240 132 248 Q135 238 140 250 Q145 236 148 248 Q152 240 155 255",
            "M125 255 Q129 238 133 246 Q136 234 140 248 Q144 232 147 246 Q151 238 155 255",
            "M125 255 Q128 240 132 248 Q135 238 140 250 Q145 236 148 248 Q152 240 155 255",
          ] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M130 255 Q133 244 137 250 Q140 242 143 250 Q147 244 150 255"
          fill="none" stroke="#FFD166" strokeWidth="1.5" strokeLinecap="round"
          animate={{ d: [
            "M130 255 Q133 244 137 250 Q140 242 143 250 Q147 244 150 255",
            "M130 255 Q134 242 138 249 Q140 240 142 249 Q146 242 150 255",
            "M130 255 Q133 244 137 250 Q140 242 143 250 Q147 244 150 255",
          ] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />

        {/* Fire door frame — fixed metal gray */}
        <rect x="98" y="228" width="84" height="44" rx="7" fill="none" stroke="#555" strokeWidth="2.5" />
        <circle cx="186" cy="250" r="3" fill="#777" /> {/* door handle */}

        {/* ========== PIPES — FIXED GRAY/SILVER ========== */}
        {/* Top chimney pipe */}
        <rect x="130" y="50" width="20" height="42" rx="3" fill="#6B6B6B" />
        <rect x="126" y="46" width="28" height="8" rx="2" fill="#7A7A7A" />
        <rect x="132" y="52" width="4" height="36" rx="1" fill="#8A8A8A" opacity="0.4" /> {/* highlight */}

        {/* Right water pipe - inlet */}
        <rect x="205" y="120" width="40" height="12" rx="4" fill="#6B6B6B" />
        <rect x="205" y="122" width="40" height="3" rx="1" fill="#8A8A8A" opacity="0.3" />
        <circle cx="245" cy="126" r="8" fill="none" stroke="#6B6B6B" strokeWidth="3" />
        <circle cx="245" cy="126" r="3" fill="#555" />

        {/* Right water pipe - outlet */}
        <rect x="205" y="170" width="35" height="12" rx="4" fill="#6B6B6B" />
        <rect x="205" y="172" width="35" height="3" rx="1" fill="#8A8A8A" opacity="0.3" />
        <circle cx="240" cy="176" r="8" fill="none" stroke="#6B6B6B" strokeWidth="3" />
        <circle cx="240" cy="176" r="3" fill="#555" />

        {/* Pipe labels */}
        <text x="248" y="112" fill="#555" fontSize="7" fontFamily="monospace">ENTRADA</text>
        <text x="248" y="165" fill="#555" fontSize="7" fontFamily="monospace">SAÍDA</text>

        {/* ========== COPPER SERPENTINE COIL (visible hint) ========== */}
        <path
          d="M95 140 Q105 135 115 140 Q125 145 135 140 Q145 135 155 140 Q165 145 175 140 Q185 135 190 140"
          fill="none" stroke="#CD7F32" strokeWidth="2" strokeLinecap="round" opacity="0.35"
        />
        <path
          d="M95 160 Q105 155 115 160 Q125 165 135 160 Q145 155 155 160 Q165 165 175 160 Q185 155 190 160"
          fill="none" stroke="#CD7F32" strokeWidth="2" strokeLinecap="round" opacity="0.25"
        />

        {/* ========== TEMPERATURE GAUGE — fixed ========== */}
        <circle cx="140" cy="115" r="12" fill="#1A1A1A" stroke="#555" strokeWidth="1.5" />
        <circle cx="140" cy="115" r="8" fill="#0D0D0D" />
        <line x1="140" y1="115" x2="146" y2="110" stroke="#FF4F00" strokeWidth="1.5" strokeLinecap="round" />
        <text x="133" y="128" fill="#555" fontSize="5" fontFamily="monospace">°C</text>

        {/* ========== BRAND LABEL ========== */}
        <motion.rect
          x="105" y="186" width="70" height="12" rx="2"
          animate={{ fill: darken(colorHex, 25) }}
          transition={{ duration: 0.6 }}
        />
        <text x="115" y="195" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="2">
          LINHA BRASA
        </text>
      </svg>
    </div>
  );
}
