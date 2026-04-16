import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw } from 'lucide-react';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Parse the notes string back into recipe items
function parseBlendNotes(notes) {
  if (!notes) return null;
  // Format: "Label · 5oz Bottle A, 3.5oz Bottle B, ... · Marry 14–30 Days"
  const marryMatch = notes.match(/Marry (.+)$/);
  const marryingTime = marryMatch ? marryMatch[1] : null;

  // Extract label (before first ·)
  const parts = notes.split(' · ');
  const label = parts[0] || '';

  // Extract items (between first · and last ·)
  const itemsStr = parts[1] || '';
  const itemMatches = [...itemsStr.matchAll(/(\d+(?:\.\d+)?)oz ([^,]+)/g)];
  const items = itemMatches.map(m => ({
    oz: parseFloat(m[1]),
    bottle: { bottle_name: m[2].trim() },
  }));

  if (items.length === 0) return null;

  const totalOz = items.reduce((s, i) => s + i.oz, 0) || 1;
  const parsed = items.map(i => ({
    ...i,
    ratio: i.oz / totalOz,
    percentage: Math.round((i.oz / totalOz) * 100),
  }));

  return { items: parsed, label, marryingTime };
}

function RecipeDetailModal({ bottle, onClose }) {
  const recipe = parseBlendNotes(bottle.notes);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/85 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="w-full max-w-lg bg-card border rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{ borderColor: 'rgba(212,175,55,0.25)', maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.04)' }}>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">Infinity Archives · Recipe Card</p>
            <h2 className="font-heading text-lg text-foreground mt-0.5 pr-6">{bottle.bottle_name}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 space-y-5" style={{ maxHeight: 'calc(85vh - 72px)' }}>
          {recipe ? (
            <>
              {/* Label */}
              <p className="text-[10px] uppercase tracking-[0.3em] font-body" style={{ color: '#D4AF37' }}>{recipe.label}</p>

              {/* Components */}
              <div className="space-y-3">
                {recipe.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-12 text-right shrink-0">
                      <span className="font-heading text-xl" style={{ color: '#D4AF37', textShadow: '0 0 10px rgba(212,175,55,0.3)' }}>
                        {item.oz}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-0.5">oz</span>
                    </div>
                    <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, rgba(212,175,55,${0.1 + item.ratio * 0.5}), transparent)` }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm text-foreground truncate">{item.bottle.bottle_name}</p>
                      <p className="text-[10px] text-muted-foreground font-body">{item.percentage}% of batch</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Batch total */}
              <div className="flex justify-between text-xs font-body pt-3 border-t border-border">
                <span className="text-muted-foreground uppercase tracking-widest">Batch Total</span>
                <span className="text-foreground">{recipe.items.reduce((s, i) => s + i.oz, 0).toFixed(1)} oz · 750ml</span>
              </div>

              {/* Marrying Time */}
              {recipe.marryingTime && (
                <div className="border border-border rounded-md p-3" style={{ background: 'rgba(212,175,55,0.03)' }}>
                  <p className="text-[10px] uppercase tracking-widest font-body mb-1" style={{ color: '#D4AF37' }}>Marriage Period</p>
                  <p className="text-sm font-body text-foreground">{recipe.marryingTime}</p>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground font-body text-sm">Recipe details unavailable for this blend.</p>
              {bottle.notes && <p className="text-muted-foreground/50 font-body text-xs mt-2 italic">{bottle.notes}</p>}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function InfinityArchiveCard({ bottle, onDelete }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div
        className="group border border-border rounded-md p-4 bg-card hover:border-primary/30 transition-all duration-300 cursor-pointer"
        style={{ background: 'rgba(212,175,55,0.02)' }}
        onClick={() => setShowDetail(true)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <span
              className="text-[10px] uppercase tracking-widest font-body px-2 py-0.5 rounded border inline-block mb-2"
              style={{ color: '#D4AF37', borderColor: 'rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.06)' }}
            >
              Infinity Blend
            </span>
            <h3 className="font-heading text-base text-foreground truncate">{bottle.bottle_name}</h3>
            <p className="text-[10px] text-muted-foreground/60 font-body mt-1 italic">Tap to view Recipe Card</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(bottle); }} className="text-destructive">
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AnimatePresence>
        {showDetail && <RecipeDetailModal bottle={bottle} onClose={() => setShowDetail(false)} />}
      </AnimatePresence>
    </>
  );
}