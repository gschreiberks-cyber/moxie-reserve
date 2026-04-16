import React from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function HuntBottleDetail({ item, onClose }) {
  const msrp = item.target_price || null;
  const secondary = item.market_price || null;
  const delta = msrp && secondary ? secondary - msrp : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-lg bg-card border border-border rounded-t-2xl sm:rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-start justify-between"
          style={{ background: 'rgba(212,175,55,0.03)' }}>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">Bottle Detail</p>
            <h2 className="font-heading text-xl text-foreground mt-0.5">{item.bottle_name}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Price grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-border rounded-md p-4 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body mb-1">Anticipated MSRP</p>
              <p className="font-heading text-2xl text-foreground">
                {msrp ? `$${msrp}` : '—'}
              </p>
            </div>
            <div className="border border-border rounded-md p-4 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body mb-1">Est. Secondary</p>
              <p className="font-heading text-2xl" style={{ color: secondary ? '#D4AF37' : undefined, textShadow: secondary ? '0 0 12px rgba(212,175,55,0.4)' : undefined }}>
                {secondary ? `$${secondary}` : '—'}
              </p>
            </div>
          </div>

          {/* Delta */}
          {delta !== null && (
            <div className="flex items-center justify-center gap-2 py-2">
              {delta > 0 && <><TrendingUp className="w-4 h-4 text-destructive" /><span className="text-sm font-body text-destructive">${delta} above MSRP on secondary</span></>}
              {delta < 0 && <><TrendingDown className="w-4 h-4 text-green-500" /><span className="text-sm font-body text-green-500">${Math.abs(delta)} below MSRP</span></>}
              {delta === 0 && <><Minus className="w-4 h-4 text-muted-foreground" /><span className="text-sm font-body text-muted-foreground">At MSRP</span></>}
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="border border-border rounded-md p-4" style={{ background: 'rgba(255,255,255,0.01)' }}>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body mb-2">Hunt Notes</p>
              <p className="text-sm font-body text-foreground/80 italic leading-relaxed">{item.notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}