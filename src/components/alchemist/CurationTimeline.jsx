import React, { useState } from 'react';
import { motion } from 'framer-motion';

function getPhases(blendTypeId) {
  if (blendTypeId === 'core') {
    return [
      { label: 'Phase 1', desc: 'Blend components. Allow to marry for 7–14 days.' },
    ];
  }
  if (blendTypeId === 'premier') {
    return [
      { label: 'Phase 1', desc: 'Blend components. Allow to marry for 14–30 days.' },
    ];
  }
  if (blendTypeId === 'vestige') {
    return [
      { label: 'Phase 1', desc: 'Blend the Core & Premier foundation. Rest for 14 days.' },
      { label: 'Phase 2', desc: 'Introduce the Vestige expression. Marry for an additional 14–30 days.' },
    ];
  }
  if (blendTypeId === 'apex') {
    return [
      { label: 'Phase 1 — The Foundation', desc: 'Blend the base expressions. Rest for 14 days.' },
      { label: 'Phase 2 — The Enhancement', desc: 'Introduce enhancement expressions. Marry for 30 days.' },
      { label: 'Phase 3 — The Crown', desc: 'Add the crown expression. Final marriage for 30–45 days.' },
    ];
  }
  return [];
}

export default function CurationTimeline({ blendTypeId }) {
  const phases = getPhases(blendTypeId);
  const [checked, setChecked] = useState(() => phases.map(() => false));

  const toggle = (idx) => {
    setChecked(prev => prev.map((v, i) => i === idx ? !v : v));
  };

  if (phases.length === 0) return null;

  return (
    <div className="pt-3 border-t border-border space-y-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">Curation Timeline</p>
      {phases.map((phase, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-start gap-3"
        >
          {/* Checkbox */}
          <button
            onClick={() => toggle(idx)}
            className="mt-0.5 w-4 h-4 rounded-sm border shrink-0 flex items-center justify-center transition-all"
            style={{
              borderColor: checked[idx] ? '#D4AF37' : 'rgba(212,175,55,0.3)',
              background: checked[idx] ? 'rgba(212,175,55,0.15)' : 'transparent',
            }}
          >
            {checked[idx] && (
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                <path d="M1 3L3 5L7 1" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          {/* Phase text */}
          <div className="flex-1">
            <p
              className="text-[10px] uppercase tracking-widest font-body mb-0.5"
              style={{ color: checked[idx] ? '#6b5c2e' : '#D4AF37' }}
            >
              {phase.label}
            </p>
            <p
              className="text-xs font-body leading-relaxed"
              style={{ color: checked[idx] ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))', opacity: checked[idx] ? 0.5 : 1 }}
            >
              {phase.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}