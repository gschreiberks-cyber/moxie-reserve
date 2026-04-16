import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shuffle, Hand, Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const VOLUME_MAP = { Full: 750, Half: 375, Quarter: 185 };

function buildRatios(selected) {
  const batchOz = 25.4; // ~750ml
  const weights = selected.map(b => (b.proof || 90) + Math.random() * 10);
  const totalW = weights.reduce((s, w) => s + w, 0);
  let items = selected.map((bottle, i) => {
    const ratio = weights[i] / totalW;
    const oz = Math.round(ratio * batchOz * 2) / 2; // nearest 0.5
    return { bottle, oz };
  });
  const totalOz = items.reduce((s, i) => s + i.oz, 0) || 1;
  items = items.map(i => ({
    ...i,
    ratio: i.oz / totalOz,
    percentage: Math.round((i.oz / totalOz) * 100),
  }));
  const diff = 100 - items.reduce((s, i) => s + i.percentage, 0);
  items[0].percentage += diff;
  return items;
}

// ── Bespoke Formulation ──────────────────────────────────────────────────────
function BespokeFormulation({ openBottles, onSave }) {
  const [selected, setSelected] = useState([]);

  const toggle = (bottle) => {
    setSelected(prev =>
      prev.find(b => b.id === bottle.id)
        ? prev.filter(b => b.id !== bottle.id)
        : [...prev, bottle]
    );
  };

  const items = selected.length > 0 ? buildRatios(selected) : [];

  const rarityColor = { Core: '#A9A9A9', Premier: '#D4AF37', Vestige: '#B87333' };

  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground font-body">Select the expressions you wish to marry.</p>

      {/* Bottle selector */}
      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
        {openBottles.map(bottle => {
          const active = !!selected.find(b => b.id === bottle.id);
          return (
            <button
              key={bottle.id}
              onClick={() => toggle(bottle)}
              className={`w-full flex items-center gap-3 p-3 rounded-md border text-left transition-all ${
                active ? 'border-primary/60 bg-primary/5' : 'border-border hover:border-border/60'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${active ? 'border-primary bg-primary/20' : 'border-muted-foreground/40'}`}>
                {active && <Check className="w-3 h-3 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm text-foreground truncate">{bottle.bottle_name}</p>
                <p className="text-[10px] font-body" style={{ color: rarityColor[bottle.rarity] || '#A9A9A9' }}>
                  {bottle.rarity} {bottle.proof ? `· ${bottle.proof}°` : ''}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Preview ratios */}
      {items.length > 0 && (
        <div className="border border-border rounded-md p-4 space-y-3" style={{ background: 'rgba(212,175,55,0.03)' }}>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">Proposed Ratios</p>
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="font-heading text-base w-10 text-right shrink-0" style={{ color: '#D4AF37' }}>{item.oz}oz</span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, rgba(212,175,55,${0.1 + item.ratio * 0.5}), transparent)` }} />
              <p className="font-body text-xs text-foreground truncate flex-1">{item.bottle.bottle_name}</p>
            </div>
          ))}
          <div className="pt-2 border-t border-border flex justify-between text-xs font-body">
            <span className="text-muted-foreground uppercase tracking-widest">Marrying Time</span>
            <span style={{ color: '#D4AF37' }}>21–45 Days</span>
          </div>
          <Button
            onClick={() => onSave(items, '21–45 Days', 'Apex — Bespoke Formulation')}
            className="w-full gold-btn text-xs uppercase tracking-widest font-body"
            disabled={selected.length < 2}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Blend
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Algorithmic Curation ─────────────────────────────────────────────────────
function AlgorithmicCuration({ openBottles, onSave }) {
  const [sweetness, setSweetness] = useState([50]);
  const [spice, setSpice] = useState([50]);
  const [heat, setHeat] = useState([50]);
  const [result, setResult] = useState(null);

  const curate = () => {
    // Score each bottle against profile
    const scored = openBottles.map(bottle => {
      const proofScore = Math.abs((bottle.proof || 90) - (60 + heat[0] * 0.9));
      // Core = sweet-leaning, Vestige = spice, Premier = balanced
      const rarityScore =
        bottle.rarity === 'Core'    ? Math.abs(sweetness[0] - 70) :
        bottle.rarity === 'Vestige' ? Math.abs(spice[0] - 70) :
        Math.abs(sweetness[0] - spice[0]);
      return { bottle, score: proofScore + rarityScore };
    });

    const sorted = scored.sort((a, b) => a.score - b.score);
    const selected = sorted.slice(0, Math.min(4, sorted.length)).map(s => s.bottle);
    const items = buildRatios(selected);

    const marryDays = 14 + Math.round((sweetness[0] + spice[0] + heat[0]) / 3 * 0.31);
    setResult({ items, marryingTime: `${marryDays}–${marryDays + 14} Days` });
  };

  const sliders = [
    { label: 'Sweetness / Corn', left: 'Dry', right: 'Sweet', value: sweetness, onChange: setSweetness },
    { label: 'Spice / Rye', left: 'Mild', right: 'Bold', value: spice, onChange: setSpice },
    { label: 'Heat / Proof', left: 'Low', right: 'High', value: heat, onChange: setHeat },
  ];

  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground font-body">Dial in your flavor profile. The Alchemist will curate the ideal blend.</p>

      <div className="space-y-5">
        {sliders.map(s => (
          <div key={s.label} className="border border-border rounded-md p-4" style={{ background: 'rgba(255,255,255,0.01)' }}>
            <p className="text-[10px] uppercase tracking-widest font-body mb-3" style={{ color: '#D4AF37' }}>{s.label}</p>
            <div className="flex justify-between text-[10px] text-muted-foreground font-body mb-2">
              <span>{s.left}</span><span>{s.right}</span>
            </div>
            <Slider value={s.value} onValueChange={s.onChange} min={0} max={100} step={1} />
          </div>
        ))}
      </div>

      <Button onClick={curate} className="w-full gold-btn text-xs uppercase tracking-widest font-body">
        <Shuffle className="w-4 h-4 mr-2" />
        Curate Blend
      </Button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-border rounded-md p-4 space-y-3"
          style={{ background: 'rgba(212,175,55,0.03)' }}
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">Curated Recipe</p>
          {result.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="font-heading text-base w-10 text-right shrink-0" style={{ color: '#D4AF37' }}>{item.oz}oz</span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, rgba(212,175,55,${0.1 + item.ratio * 0.5}), transparent)` }} />
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs text-foreground truncate">{item.bottle.bottle_name}</p>
                <p className="text-[10px] text-muted-foreground font-body">{item.percentage}% · {item.bottle.rarity}</p>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-border flex justify-between text-xs font-body">
            <span className="text-muted-foreground uppercase tracking-widest">Marrying Time</span>
            <span style={{ color: '#D4AF37' }}>{result.marryingTime}</span>
          </div>
          <Button
            onClick={() => onSave(result.items, result.marryingTime, 'Apex — Algorithmic Curation')}
            className="w-full gold-btn text-xs uppercase tracking-widest font-body"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Blend
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// ── Apex Blend Modal ─────────────────────────────────────────────────────────
export default function ApexBlend({ openBottles, onSave, onClose }) {
  const [mode, setMode] = useState(null); // null | 'bespoke' | 'algorithmic'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/90 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="w-full max-w-lg bg-card border rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{ borderColor: 'rgba(212,175,55,0.25)', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.04)' }}>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">Premium · VIP</p>
            <h2 className="font-heading text-xl" style={{ color: '#D4AF37', textShadow: '0 0 16px rgba(212,175,55,0.3)' }}>
              The Velvet Marriage
            </h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5" style={{ maxHeight: 'calc(90vh - 72px)' }}>
          {/* Mode selection */}
          {!mode && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground font-body text-center mb-6">
                Choose your path to the perfect infinity blend.
              </p>
              <button
                onClick={() => setMode('bespoke')}
                className="w-full p-5 rounded-xl border border-border text-left hover:border-primary/40 transition-all group"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Hand className="w-5 h-5 text-primary" />
                  <p className="font-heading text-base text-foreground">Bespoke Formulation</p>
                </div>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  Hand-select exactly which expressions to marry. You choose the bottles; the Alchemist crafts the ratios.
                </p>
              </button>
              <button
                onClick={() => setMode('algorithmic')}
                className="w-full p-5 rounded-xl border border-border text-left hover:border-primary/40 transition-all group"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Shuffle className="w-5 h-5 text-primary" />
                  <p className="font-heading text-base text-foreground">Algorithmic Curation</p>
                </div>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  Dial in Sweetness, Spice, and Heat. The Alchemist's algorithm curates the ideal blend from your entire collection.
                </p>
              </button>
            </div>
          )}

          {mode === 'bespoke' && (
            <div>
              <button
                onClick={() => setMode(null)}
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground font-body mb-5 hover:text-foreground transition-colors"
              >
                ← Back
              </button>
              <BespokeFormulation openBottles={openBottles} onSave={onSave} />
            </div>
          )}

          {mode === 'algorithmic' && (
            <div>
              <button
                onClick={() => setMode(null)}
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground font-body mb-5 hover:text-foreground transition-colors"
              >
                ← Back
              </button>
              <AlgorithmicCuration openBottles={openBottles} onSave={onSave} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}