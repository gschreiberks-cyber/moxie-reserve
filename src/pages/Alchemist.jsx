import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Lock, RefreshCw, Save, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePremium } from '@/hooks/usePremium';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DragonGlassDecanter from '@/components/alchemist/DragonGlassDecanter';
import ApexBlend from '@/components/alchemist/ApexBlend';
import CurationTimeline from '@/components/alchemist/CurationTimeline';
import MashBill from '@/components/alchemist/MashBill';

const VOLUME_MAP = { Full: 750, Half: 375, Quarter: 185 };

const BLEND_TYPES = [
  {
    id: 'core',
    label: 'Core Blend',
    premium: false,
    desc: '2–3 Core expressions married together.',
  },
  {
    id: 'premier',
    label: 'Premier Blend',
    premium: false,
    desc: '1 Core foundation + 1–3 Premier enhancements.',
  },
  {
    id: 'vestige',
    label: 'Vestige Blend',
    premium: true,
    desc: '1 Core + 2 Premier + 1 Vestige bolster.',
  },
  {
    id: 'apex',
    label: 'The Velvet Marriage',
    premium: true,
    desc: 'VIP — Bespoke formulation or algorithmic curation.',
    isApex: true,
  },
];

// ── True master-distiller blend logic ───────────────────────────────────────
function generateBlend(openBottles, blendTypeId) {
  const cores    = openBottles.filter(b => b.rarity === 'Core');
  const premiers = openBottles.filter(b => b.rarity === 'Premier');
  const vestiges = openBottles.filter(b => b.rarity === 'Vestige');

  let selected = [];
  let marryingTime = '';

  if (blendTypeId === 'core') {
    // 2–3 Core bourbons
    if (cores.length < 2) return null;
    selected = cores.slice(0, Math.min(3, cores.length));
    marryingTime = '7–14 Days';
  } else if (blendTypeId === 'premier') {
    // 1 Core foundation + 1–3 Premier enhancements
    if (cores.length < 1 || premiers.length < 1) return null;
    const foundation = cores.slice(0, 1);
    const enhancements = premiers.slice(0, Math.min(3, premiers.length));
    selected = [...foundation, ...enhancements];
    marryingTime = '14–30 Days';
  } else if (blendTypeId === 'vestige') {
    // 1 Core + 2 Premier + 1 Vestige
    if (cores.length < 1 || premiers.length < 2 || vestiges.length < 1) return null;
    selected = [cores[0], premiers[0], premiers[1], vestiges[0]];
    marryingTime = '30–45 Days';
  } else {
    return null;
  }

  // Build ratios weighted by proof, round oz to nearest 0.5
  const weights = selected.map(b => (b.proof || 90) + Math.random() * 8);
  const totalW = weights.reduce((s, w) => s + w, 0);
  const batchOz = 25.4; // ~750ml total

  let items = selected.map((bottle, i) => {
    const ratio = weights[i] / totalW;
    const rawOz = ratio * batchOz;
    const oz = Math.round(rawOz * 2) / 2; // round to nearest 0.5
    return { bottle, ratio, oz };
  });

  // Recalculate percentages from rounded oz values
  const totalOz = items.reduce((s, i) => s + i.oz, 0) || 1;
  items = items.map(i => ({
    ...i,
    percentage: Math.round((i.oz / totalOz) * 100),
    ratio: i.oz / totalOz,
  }));

  // Fix percentage rounding drift
  const pctDiff = 100 - items.reduce((s, i) => s + i.percentage, 0);
  items[0].percentage += pctDiff;

  return { items, marryingTime, blendTypeId };
}

// ── Role badge for each bottle in the recipe ───────────────────────────────
function roleBadge(blendTypeId, idx) {
  if (blendTypeId === 'core')    return idx === 0 ? 'Lead' : 'Support';
  if (blendTypeId === 'premier') return idx === 0 ? 'Foundation' : 'Enhancement';
  if (blendTypeId === 'vestige') {
    if (idx === 0) return 'Foundation';
    if (idx < 3)  return 'Enhancement';
    return 'Bolster';
  }
  return '';
}

function RecipeCard({ result, onSave, onRegenerate }) {
  const totalOz = result.items.reduce((s, i) => s + i.oz, 0).toFixed(1);
  const blendLabel = BLEND_TYPES.find(t => t.id === result.blendTypeId)?.label || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="border border-border rounded-md overflow-hidden"
      style={{ background: 'rgba(212,175,55,0.03)' }}
    >
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">Recipe Card</p>
          <h3 className="font-heading text-lg text-foreground mt-0.5">{blendLabel}</h3>
        </div>
        <button onClick={onRegenerate} className="text-muted-foreground hover:text-primary transition-colors p-1">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {result.items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 text-right shrink-0">
              <span className="font-heading text-xl" style={{ color: '#D4AF37', textShadow: '0 0 10px rgba(212,175,55,0.3)' }}>
                {item.oz}
              </span>
              <span className="text-[10px] text-muted-foreground ml-0.5">oz</span>
            </div>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, rgba(212,175,55,${0.1 + item.ratio * 0.4}), transparent)` }} />
            <div className="flex-1 min-w-0">
              <p className="font-heading text-sm text-foreground truncate">{item.bottle.bottle_name}</p>
              <p className="text-[10px] text-muted-foreground font-body">
                {roleBadge(result.blendTypeId, idx)} · {item.percentage}% {item.bottle.proof ? `· ${item.bottle.proof}°` : ''}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="px-5 pb-5 space-y-3">
        <div className="flex justify-between text-xs font-body pt-3 border-t border-border">
          <span className="text-muted-foreground uppercase tracking-widest">Batch Total</span>
          <span className="text-foreground">{totalOz} oz · 750ml</span>
        </div>
        <CurationTimeline blendTypeId={result.blendTypeId} />
        <MashBill items={result.items} />
        <Button onClick={onSave} className="w-full gold-btn mt-2 text-xs uppercase tracking-widest font-body">
          <Save className="w-4 h-4 mr-2" />
          Save to Library
        </Button>
      </div>
    </motion.div>
  );
}

export default function Alchemist() {
  const [selectedType, setSelectedType] = useState('core');
  const [blend, setBlend] = useState(null);
  const [showApex, setShowApex] = useState(false);
  const [decanterFill, setDecanterFill] = useState(0);
  const { isPremium } = usePremium();
  const queryClient = useQueryClient();

  const { data: bottles = [] } = useQuery({
    queryKey: ['bottles'],
    queryFn: () => base44.entities.UserBottle.list(),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.UserBottle.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bottles'] });
      toast.success('Blend saved to your Library.');
    },
  });

  const openBottles = bottles.filter(b => b.status === 'Open' && !b.is_infinity_blend);
  const idleFill = Math.min(0.3, openBottles.length / 6 * 0.3);

  const handleGenerate = () => {
    const result = generateBlend(openBottles, selectedType);
    if (!result) {
      const type = BLEND_TYPES.find(t => t.id === selectedType);
      const req =
        selectedType === 'core'    ? 'at least 2 open Core bottles' :
        selectedType === 'premier' ? '1 open Core + 1 open Premier bottle' :
        '1 Core, 2 Premier, and 1 Vestige open bottle';
      toast.error(`Requires ${req}.`);
      return;
    }
    setBlend(result);
    setDecanterFill(0.45 + Math.random() * 0.4);
  };

  const handleSave = () => {
    if (!blend) return;
    const names = blend.items.map(i => i.bottle.bottle_name).join(' + ');
    const label = BLEND_TYPES.find(t => t.id === blend.blendTypeId)?.label || 'Blend';
    saveMutation.mutate({
      bottle_name: `Infinity: ${names}`,
      distillery: 'Custom Blend',
      notes: `${label} · ${blend.items.map(i => `${i.oz}oz ${i.bottle.bottle_name}`).join(', ')} · Marry ${blend.marryingTime}`,
      status: 'Open',
      estimated_volume: 'Full',
      rarity: 'Premier',
      is_infinity_blend: true,
    });
  };

  const handleApexSave = (items, marryingTime, label) => {
    const names = items.map(i => i.bottle.bottle_name).join(' + ');
    saveMutation.mutate({
      bottle_name: `Infinity: ${names}`,
      distillery: 'Custom Blend',
      notes: `${label} · ${items.map(i => `${i.oz}oz ${i.bottle.bottle_name}`).join(', ')} · Marry ${marryingTime}`,
      status: 'Open',
      estimated_volume: 'Full',
      rarity: 'Vestige',
      is_infinity_blend: true,
    });
    setShowApex(false);
    toast.success('Apex blend saved to your Library.');
  };

  const coresCount    = openBottles.filter(b => b.rarity === 'Core').length;
  const premiersCount = openBottles.filter(b => b.rarity === 'Premier').length;
  const vestgesCount  = openBottles.filter(b => b.rarity === 'Vestige').length;

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto pb-10">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] font-body mb-1" style={{ color: '#D4AF37' }}>
          Moxie Reserve
        </p>
        <h1 className="font-heading text-3xl text-foreground">The Alchemist</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Infinity bottle blending curator.</p>
      </div>

      {/* Dragon-glass decanter */}
      <div className="flex flex-col items-center py-4">
        <DragonGlassDecanter fillLevel={blend ? decanterFill : idleFill} />
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body mt-1">
          {coresCount}C · {premiersCount}P · {vestgesCount}V open
        </p>
      </div>

      {openBottles.length < 2 ? (
        <div className="text-center py-8 border border-border rounded-md bg-card">
          <p className="text-muted-foreground font-body text-sm px-6">
            Mark at least 2 bottles as <span className="text-foreground">"Open"</span> in your Library to begin blending.
          </p>
          <Link to="/library">
            <Button variant="outline" className="mt-4 border-border text-xs uppercase tracking-widest font-body">
              <BookOpen className="w-4 h-4 mr-2" />
              Go to Library
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Blend Type Selection */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {BLEND_TYPES.map(type => {
              const locked = type.premium && !isPremium;
              const active = selectedType === type.id && !locked;
              const isApex = type.isApex;
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    if (locked) return;
                    if (isApex) { setShowApex(true); return; }
                    setSelectedType(type.id);
                    setBlend(null);
                  }}
                  className={`relative p-3 rounded-md border text-left transition-all duration-200 ${
                    active
                      ? 'border-primary/60 bg-primary/5'
                      : locked
                        ? 'border-border opacity-50 cursor-not-allowed'
                        : isApex
                          ? 'border-primary/30 hover:border-primary/60'
                          : 'border-border hover:border-border/80'
                  }`}
                  style={isApex && !locked ? { background: 'rgba(212,175,55,0.04)' } : {}}
                >
                  {locked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                  <p className={`font-body text-xs font-medium uppercase tracking-wider ${
                    active ? 'text-primary' : isApex && !locked ? 'text-primary' : 'text-foreground'
                  }`}>
                    {type.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-body mt-0.5 leading-snug">{type.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Premium upsell */}
          {(selectedType === 'vestige') && !isPremium && (
            <div className="mb-4 p-3 border border-primary/20 rounded-md flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-body">Unlock Vestige & The Velvet Marriage</p>
              <Link to="/settings">
                <Button size="sm" className="gold-btn text-[10px] uppercase tracking-widest font-body h-7 px-3">
                  Upgrade
                </Button>
              </Link>
            </div>
          )}

          {/* What's required hint */}
          <div className="border border-border rounded-md p-3 mb-5 text-[10px] font-body text-muted-foreground space-y-1"
            style={{ background: 'rgba(255,255,255,0.01)' }}>
            {selectedType === 'core'    && <p>Requires 2–3 open <span className="text-foreground">Core</span> bottles ({coresCount} available).</p>}
            {selectedType === 'premier' && <p>Requires 1 open <span className="text-foreground">Core</span> ({coresCount}) + 1–3 open <span className="text-foreground">Premier</span> ({premiersCount}).</p>}
            {selectedType === 'vestige' && <p>Requires 1 <span className="text-foreground">Core</span> ({coresCount}) · 2 <span className="text-foreground">Premier</span> ({premiersCount}) · 1 <span className="text-foreground">Vestige</span> ({vestgesCount}).</p>}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={BLEND_TYPES.find(t => t.id === selectedType)?.premium && !isPremium}
            className="w-full gold-btn text-xs uppercase tracking-widest font-body mb-6"
          >
            Compose Blend
          </Button>

          <AnimatePresence mode="wait">
            {blend && (
              <RecipeCard
                result={blend}
                onSave={handleSave}
                onRegenerate={handleGenerate}
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* Apex Blend Modal */}
      <AnimatePresence>
        {showApex && (
          <ApexBlend
            openBottles={openBottles}
            onSave={handleApexSave}
            onClose={() => setShowApex(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}