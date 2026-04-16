import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Splash({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, #1a1a1a 0%, #0B0B0B 60%)',
          }}
        >
          {/* Decanter SVG Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            {/* Logo placeholder ring */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{
                border: '1.5px solid rgba(212,175,55,0.35)',
                background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, rgba(11,11,11,0) 70%)',
                boxShadow: '0 0 28px rgba(212,175,55,0.12)',
              }}
            >
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-body text-center leading-tight px-1">
                Logo<br/>Here
              </span>
            </div>

            {/* Decanter SVG mark */}
            <svg width="56" height="68" viewBox="0 0 72 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E1C16E" />
                  <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Decanter body */}
              <path
                d="M28 12 L22 30 C14 42 10 52 10 62 C10 76 22 84 36 84 C50 84 62 76 62 62 C62 52 58 42 50 30 L44 12 Z"
                fill="none"
                stroke="url(#goldGrad)"
                strokeWidth="1.5"
                filter="url(#glow)"
              />
              {/* Neck */}
              <rect x="28" y="4" width="16" height="12" rx="2" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" filter="url(#glow)" />
              {/* Stopper */}
              <ellipse cx="36" cy="4" rx="8" ry="3.5" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" filter="url(#glow)" />
              {/* Liquid fill line */}
              <path
                d="M14 58 Q36 54 58 58"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.5"
              />
              {/* Shine */}
              <path
                d="M25 35 Q27 50 26 62"
                fill="none"
                stroke="#E1C16E"
                strokeWidth="0.8"
                opacity="0.4"
              />
            </svg>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="font-heading text-3xl tracking-wide mb-1"
              style={{
                color: '#D4AF37',
                textShadow: '0 0 20px rgba(212,175,55,0.4)',
              }}
            >
              Moxie Reserve
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="text-[10px] uppercase tracking-[0.4em] font-body"
              style={{ color: '#6b5c2e' }}
            >
              Private Collection
            </motion.p>
          </motion.div>

          {/* Bottom shimmer line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-16 w-16 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}