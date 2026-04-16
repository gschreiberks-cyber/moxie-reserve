import React from 'react';
import { motion } from 'framer-motion';

export default function DragonGlassDecanter({ fillLevel = 0 }) {
  const maxFill = 62;
  const clampedFill = Math.max(0, Math.min(1, fillLevel));
  const fillHeight = maxFill * clampedFill;
  const fillY = 86 - fillHeight;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 160 }}>
      {/* Ambient glow under decanter */}
      {clampedFill > 0.1 && (
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
          style={{
            width: 80,
            height: 16,
            background: 'radial-gradient(ellipse, rgba(212,175,55,0.22) 0%, transparent 70%)',
            filter: 'blur(6px)',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />
      )}

      <svg width="130" height="155" viewBox="0 0 72 92" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Gold outline gradient */}
          <linearGradient id="dgGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F0E0A0" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9A7820" />
          </linearGradient>

          {/* Swirling amber — uses animateTransform for rotation */}
          <radialGradient id="amberSwirl" cx="40%" cy="30%" r="65%" fx="40%" fy="30%">
            <stop offset="0%"  stopColor="#F5C842" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#C8740A" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#7B3A08" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3D1A04" stopOpacity="0.95" />
          </radialGradient>

          {/* Second swirl layer offset for depth */}
          <radialGradient id="amberSwirl2" cx="60%" cy="70%" r="55%" fx="60%" fy="70%">
            <stop offset="0%"  stopColor="#E8A020" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#8B4513" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1a0800" stopOpacity="0.0" />
          </radialGradient>

          {/* Dragon-glass facet tint */}
          <linearGradient id="crystalTint" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"  stopColor="#1a1a2e" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#0d0d0d" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.10" />
          </linearGradient>

          {/* Clip to decanter body shape */}
          <clipPath id="dgClip">
            <path d="M29 13 L23 31 C15 44 11 54 11 64 C11 77 22 86 36 86 C50 86 61 77 61 64 C61 54 57 44 49 31 L43 13 Z" />
          </clipPath>

          {/* Gold glow filter */}
          <filter id="dgGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Inner liquid glow */}
          <filter id="dgLiquidGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Dragon-glass faceted body fill (dark crystal look) ── */}
        <path
          d="M29 13 L23 31 C15 44 11 54 11 64 C11 77 22 86 36 86 C50 86 61 77 61 64 C61 54 57 44 49 31 L43 13 Z"
          fill="url(#crystalTint)"
        />

        {/* ── Liquid fill — animated rise ── */}
        <motion.rect
          x="0" width="72"
          initial={{ y: 86, height: 0 }}
          animate={{ y: fillY, height: fillHeight }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          clipPath="url(#dgClip)"
          filter="url(#dgLiquidGlow)"
        >
          {/* The fill uses an SVG rect with a nested image-like approach via foreignObject isn't possible,
              so we layer both gradients with opacity */}
          <animate attributeName="opacity" values="0.88;0.95;0.88" dur="4s" repeatCount="indefinite" />
        </motion.rect>

        {/* Primary swirling amber layer */}
        <motion.rect
          x="0" width="72"
          initial={{ y: 86, height: 0 }}
          animate={{ y: fillY, height: fillHeight }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          fill="url(#amberSwirl)"
          clipPath="url(#dgClip)"
          filter="url(#dgLiquidGlow)"
          opacity="0.88"
        />

        {/* Secondary swirl overlay */}
        <motion.rect
          x="0" width="72"
          initial={{ y: 86, height: 0 }}
          animate={{ y: fillY, height: fillHeight }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.1 }}
          fill="url(#amberSwirl2)"
          clipPath="url(#dgClip)"
          opacity="0.6"
        />

        {/* Animated shimmer wave on liquid surface */}
        {clampedFill > 0.05 && (
          <motion.ellipse
            cx="36" rx="22" ry="2"
            initial={{ cy: 86, opacity: 0 }}
            animate={{ cy: fillY, opacity: [0, 0.35, 0.2, 0.35] }}
            transition={{
              cy: { duration: 1.4, ease: 'easeOut' },
              opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 },
            }}
            fill="none"
            stroke="#F5C842"
            strokeWidth="0.6"
            strokeDasharray="6 4"
          />
        )}

        {/* ── Dragon-glass facet lines ── */}
        {/* Main vertical spine */}
        <line x1="36" y1="13" x2="36" y2="86" stroke="#D4AF37" strokeWidth="0.3" opacity="0.12" />
        {/* Left diagonal facets */}
        <line x1="36" y1="13" x2="22" y2="42" stroke="#D4AF37" strokeWidth="0.4" opacity="0.18" />
        <line x1="36" y1="13" x2="14" y2="60" stroke="#C9922A" strokeWidth="0.3" opacity="0.12" />
        <line x1="22" y1="42" x2="11" y2="68" stroke="#D4AF37" strokeWidth="0.35" opacity="0.14" />
        <line x1="14" y1="60" x2="15" y2="80" stroke="#C9922A" strokeWidth="0.3" opacity="0.10" />
        {/* Right diagonal facets */}
        <line x1="36" y1="13" x2="50" y2="42" stroke="#D4AF37" strokeWidth="0.4" opacity="0.18" />
        <line x1="36" y1="13" x2="58" y2="60" stroke="#C9922A" strokeWidth="0.3" opacity="0.12" />
        <line x1="50" y1="42" x2="61" y2="68" stroke="#D4AF37" strokeWidth="0.35" opacity="0.14" />
        <line x1="58" y1="60" x2="57" y2="80" stroke="#C9922A" strokeWidth="0.3" opacity="0.10" />
        {/* Horizontal cross-cuts */}
        <line x1="18" y1="48" x2="54" y2="48" stroke="#D4AF37" strokeWidth="0.25" opacity="0.10" />
        <line x1="13" y1="66" x2="59" y2="66" stroke="#D4AF37" strokeWidth="0.25" opacity="0.10" />

        {/* ── Decanter body outline (gold, glowing) ── */}
        <path
          d="M29 13 L23 31 C15 44 11 54 11 64 C11 77 22 86 36 86 C50 86 61 77 61 64 C61 54 57 44 49 31 L43 13 Z"
          fill="none"
          stroke="url(#dgGold)"
          strokeWidth="1.3"
          filter="url(#dgGoldGlow)"
        />

        {/* ── Neck ── */}
        <rect x="29" y="5" width="14" height="11" rx="2"
          fill="none" stroke="url(#dgGold)" strokeWidth="1.3" filter="url(#dgGoldGlow)" />
        {/* Neck inner facet */}
        <line x1="36" y1="5" x2="36" y2="16" stroke="#D4AF37" strokeWidth="0.3" opacity="0.2" />

        {/* ── Stopper ── */}
        <ellipse cx="36" cy="3" rx="7" ry="3"
          fill="rgba(212,175,55,0.06)" stroke="url(#dgGold)" strokeWidth="1.3" filter="url(#dgGoldGlow)" />
        {/* Stopper cross facets */}
        <line x1="29" y1="3" x2="43" y2="3" stroke="#D4AF37" strokeWidth="0.35" opacity="0.25" />
        <line x1="36" y1="0.5" x2="36" y2="5.5" stroke="#D4AF37" strokeWidth="0.35" opacity="0.25" />

        {/* ── Highlight shines ── */}
        <path d="M23 36 Q25 53 24 67" fill="none" stroke="#F0E0A0" strokeWidth="0.8" opacity="0.22" />
        <path d="M29 20 Q30 30 29 38" fill="none" stroke="#F0E0A0" strokeWidth="0.5" opacity="0.18" />
        {/* Right edge counter-shine */}
        <path d="M49 36 Q47 53 48 67" fill="none" stroke="#C9922A" strokeWidth="0.5" opacity="0.10" />
      </svg>
    </div>
  );
}