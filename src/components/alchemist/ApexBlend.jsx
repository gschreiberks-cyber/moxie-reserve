import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shuffle, Hand, Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import CurationTimeline from '@/components/alchemist/CurationTimeline';
import MashBill from '@/components/alchemist/MashBill';

const CAPACITY_OPTIONS = [
  { label: '50%', sub: 'The Genesis',   oz: 12.7  },
  { label: '75%', sub: 'The Evolution', oz: 19.05 },
  { label: '100%', sub: 'The Opus',     oz: 25.4  },
];

// ── Golden Ratio allocator (mirrors Alchemist page logic) ───────────────────
const VESTIGE_MAX_OZ = 1.5;
const TIER_SHARE = { Core: 0.60, Premier: 0.30, Vestige: 0.10 };

function buildRatios(selected, capacityOz = 25.4) {
  const byTier = { Core: [], Premier: [], Vestige: [] };
  selected.forEach(b => { (byTier[b.rarity] || byTier['Core']).push(b); });

  const vestCount = byTier.Vestige.length;
  const vestAlloc = vestCount > 0 ? Math.min(capacityOz * TIER_SHARE.Vestige, VESTIGE_MAX_OZ * vestCount) : 0;
  const remaining = capacityOz - vestAlloc;
  const coreCount = byTier.Core.length;
  const premCount = byTier.Premier.length;

  const coreFrac = coreCount > 0 ? TIER_SHARE.Core / (TIER_SHARE.Core + TIER_SHARE.Premier) : 0;
  const premFrac = premCount > 0 ? TIER_SHARE.Premier / (TIER_SHARE.Core + TIER_SHARE.Premier) : 1;

  function allocate(bottles, tierTotal) {
    if (bottles.length === 0) return [];
    const base = tierTotal / bottles.length;
    const jittered = bottles.map(() => base * (0.95 + Math.random() * 0.10));
    const sum = jittered.reduce((a, b) => a + b, 0);
    return bottles.map((bottle, i) => ({
      bottle,
      oz: Math.round((jittered[i] / sum) * tierTotal * 2) / 2,
    }));
  }

  const vestPerBottle = vestCount > 0 ? vestAlloc / vestCount : 0;
  const allItems = [
    ...allocate(byTier.Core, remaining * coreFrac),
    ...allocate(byTier.Premier, remaining * premFrac),
    ...byTier.Vestige.map(bottle => ({ bottle, oz: Math.round(vestPerBottle * 2) / 2 })),
  ];

  const totalOz = allItems.reduce((s, i) => s + i.oz, 0) || 1;
  const withRatios = allItems.map(i => ({
    ...i,
    ratio: i.oz / totalOz,
    percentage: Math.round((i.oz / totalOz) * 100),
  }));

  const drift = 100 - withRatios.reduce((s, i) => s + i.percentage, 0);
  const maxIdx = withRatios.reduce((mi, it, idx) => it.oz > withRatios[mi].oz ? idx : mi, 0);
  withRatios[maxIdx].percentage += drift;
  return withRatios;
}

// Phase label strictly driven by bottle rarity
function apexPhaseLabel(rarity) {
  if (rarity === 'Core')    return 'Phase 1 Foundation';
  if (rarity === 'Premier') return 'Phase 2 Enhancement';
  if (rarity === 'Vestige') return 'Phase 3 The Crown';
  return '';
}

// ── Capacity Selector ────────────────────────────────────────────────────────
function CapacitySelector({ value, onChange }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body mb-2">Curation Volume</p>
      <div className="flex gap-2">
        {CAPACITY_OPTIONS.map(opt => {
          const active = value === opt.oz;
          return (
            <button
              key={opt.label}
              onClick={() => onChange(opt.oz)}
              className="flex-1 py-2 px-1 rounded-md border text-center transition-all duration-200"
              style={active
                ? { borderColor: 'rgba(212,175,55,0.6)', background: 'rgba(212,175,55,0.08)' }
                : { borderColor: 'hsl(var(--border))', background: 'transparent' }
              }
            >
              <p className={`font-body text-xs font-medium ${active ? 'text-primary' : 'text-foreground'}`}>{opt.label}</p>
              <p className="text-[9px] text-muted-foreground font-body leading-tight mt-0.5">{opt.sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Recipe output rows shared between Bespoke & Algorithmic ─────────────────
function RecipeRows({ items, showPhases }) {
  return (
    <>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <span className="font-heading text-base w-14 text-right shrink-0" style={{ color: '#D4AF37' }}>
            {item.oz.toFixed(1)} <span className="text-[10px] text-muted-foreground font-body">oz</span>
          </span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, rgba(212,175,55,${0.1 + item.ratio * 0.5}), transparent)` }} />
          <div className="flex-1 min-w-0">
            <p className="font-body text-xs text-foreground truncate">{item.bottle.bottle_name}</p>
            <p className="text-[10px] text-muted-foreground font-body">
              {showPhases ? `${apexPhaseLabel(item.bottle.rarity)} · ` : ''}{item.percentage}% · {item.bottle.rarity}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}

// ── Bespoke Formulation ──────────────────────────────────────────────────────
function BespokeFormulation({ openBottles, onSave, capacityOz }) {
  const [selected, setSelected] = useState([]);

  const toggle = (bottle) => {
    setSelected(prev =>
      prev.find(b => b.id === bottle.id)
        ? prev.filter(b => b.id !== bottle.id)
        : [...prev, bottle]
    );
  };

  const items = selected.length > 0 ? buildRatios(selected, capacityOz) : [];
  const totalOz = items.reduce((s, i) => s + i.oz, 0).toFixed(1);

  const rarityColor = { Core: '#A9A9A9', Premier: '#D4AF37', Vestige: '#B87333' };

  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground font-body">Select the expressions you wish to marry.</p>

      {/* Bottle selector */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
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
          <RecipeRows items={items} showPhases={true} />
          <div className="flex justify-between text-xs font-body pt-2 border-t border-border">
            <span className="text-muted-foreground uppercase tracking-widest">Batch Total</span>
            <span className="text-foreground">{totalOz} oz</span>
          </div>
          <CurationTimeline blendTypeId="apex" />
          <MashBill items={items} />
          <Button
            onClick={() => onSave(items, '74–89 Days', 'Apex — Bespoke Formulation')}
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
function AlgorithmicCuration({ openBottles, onSave, capacityOz }) {
  const [sweetness, setSweetness] = useState([50]);
  const [spice, setSpice] = useState([50]);
  const [heat, setHeat] = useState([50]);
  const [result, setResult] = useState(null);

  const curate = () => {
    const scored = openBottles.map(bottle => {
      const proofScore = Math.abs((bottle.proof || 90) - (60 + heat[0] * 0.9));
      const rarityScore =
        bottle.rarity === 'Core'    ? Math.abs(sweetness[0] - 70) :
        bottle.rarity === 'Vestige' ? Math.abs(spice[0] - 70) :
        Math.abs(sweetness[0] - spice[0]);
      return { bottle, score: proofScore + rarityScore };
    });

    const sorted = scored.sort((a, b) => a.score - b.score);
    const selected = sorted.slice(0, Math.min(4, sorted.length)).map(s => s.bottle);
    const items = buildRatios(selected, capacityOz);

    const marryDays = 14 + Math.round((sweetness[0] + spice[0] + heat[0]) / 3 * 0.31);
    setResult({ items, marryingTime: `${marryDays}–${marryDays + 14} Days` });
  };

  const sliders = [
    { label: 'Sweetness / Corn', left: 'Dry', right: 'Sweet', value: sweetness, onChange: setSweetness },
    { label: 'Spice / Rye', left: 'Mild', right: 'Bold', value: spice, onChange: setSpice },
    { label: 'Heat / Proof', left: 'Low', right: 'High', value: heat, onChange: setHeat },
  ];

  const totalOz = result ? result.items.reduce((s, i) => s + i.oz, 0).toFixed(1) : '0.0';

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
          <RecipeRows items={result.items} showPhases={true} />
          <div className="flex justify-between text-xs font-body pt-2 border-t border-border">
            <span className="text-muted-foreground uppercase tracking-widest">Batch Total</span>
            <span className="text-foreground">{totalOz} oz</span>
          </div>
          <CurationTimeline blendTypeId="apex" />
          <MashBill items={result.items} />
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
  const [mode, setMode] = useState(null);
  const [capacityOz, setCapacityOz] = useState(25.4);

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

          {/* Capacity selector always visible */}
          <CapacitySelector value={capacityOz} onChange={(oz) => setCapacityOz(oz)} />

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
              <BespokeFormulation openBottles={openBottles} onSave={onSave} capacityOz={capacityOz} />
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
              <AlgorithmicCuration openBottles={openBottles} onSave={onSave} capacityOz={capacityOz} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}