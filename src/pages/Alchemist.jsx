import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Lock, RefreshCw, Save, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePremium } from '@/hooks/usePremium';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Volume in ml per tier
const VOLUME_MAP = { Full: 750, Half: 375, Quarter: 185 };

// Blend type configs
const BLEND_TYPES = [
  { id: 'core',     label: 'Core Blend',       tiers: ['Core'],                   premium: false, desc: 'A smooth pour from your Core expressions.' },
  { id: 'premier',  label: 'Premier Blend',    tiers: ['Premier'],                premium: false, desc: 'Curated from your Premier selection.' },
  { id: 'vestige',  label: 'Vestige Blend',    tiers: ['Vestige'],                premium: true,  desc: 'Your rarest expressions, composed with precision.' },
  { id: 'marriage', label: 'Complex Marriage', tiers: ['Core','Premier','Vestige'],premium: true,  desc: 'A perfectly ratioed infinity blend across all tiers.' },
];

function DecanterSvg({ fillLevel = 0, animated = false }) {
  const maxFill = 62;
  const fillHeight = maxFill * Math.max(0, Math.min(1, fillLevel));
  const fillY = 84 - fillHeight;

  return (
    <svg width="120" height="140" viewBox="0 0 72 92" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGradD" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8D48B" />
          <stop offset="100%" stopColor="#C9922A" />
        </linearGradient>
        <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DAA520" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#8B4513" stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0B0B0B" stopOpacity="0.0" />
          <stop offset="40%" stopColor="#1a1410" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0B0B0B" stopOpacity="0.0" />
        </linearGradient>
        {/* Crystal facets */}
        <clipPath id="crystalClip">
          <path d="M29 13 L23 31 C15 44 11 54 11 64 C11 77 22 86 36 86 C50 86 61 77 61 64 C61 54 57 44 49 31 L43 13 Z" />
        </clipPath>
        <filter id="goldGlow">
          <feGaussianBlur stdDeviation="1.8" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="liquidGlow">
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Crystal body fill (glass tint) */}
      <path
        d="M29 13 L23 31 C15 44 11 54 11 64 C11 77 22 86 36 86 C50 86 61 77 61 64 C61 54 57 44 49 31 L43 13 Z"
        fill="url(#bodyGrad)"
      />

      {/* Liquid amber fill — animates height */}
      <motion.rect
        x="0" width="72"
        initial={{ y: 86, height: 0 }}
        animate={{ y: fillY, height: fillHeight }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        fill="url(#amberGrad)"
        clipPath="url(#crystalClip)"
        filter="url(#liquidGlow)"
      />

      {/* Surface shimmer line on liquid */}
      {fillLevel > 0.05 && (
        <motion.line
          x1="13" x2="59"
          initial={{ y1: 86, y2: 86, opacity: 0 }}
          animate={{ y1: fillY, y2: fillY, opacity: 0.4 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          stroke="#DAA520"
          strokeWidth="0.8"
          strokeDasharray="4 3"
        />
      )}

      {/* Crystal facet lines for depth */}
      <line x1="36" y1="13" x2="29" y2="40" stroke="#D4AF37" strokeWidth="0.4" opacity="0.2" />
      <line x1="36" y1="13" x2="43" y2="40" stroke="#D4AF37" strokeWidth="0.4" opacity="0.2" />
      <line x1="22" y1="54" x2="14" y2="68" stroke="#D4AF37" strokeWidth="0.4" opacity="0.15" />
      <line x1="50" y1="54" x2="58" y2="68" stroke="#D4AF37" strokeWidth="0.4" opacity="0.15" />

      {/* Decanter body outline */}
      <path
        d="M29 13 L23 31 C15 44 11 54 11 64 C11 77 22 86 36 86 C50 86 61 77 61 64 C61 54 57 44 49 31 L43 13 Z"
        fill="none"
        stroke="url(#goldGradD)"
        strokeWidth="1.4"
        filter="url(#goldGlow)"
      />

      {/* Neck */}
      <rect x="29" y="5" width="14" height="11" rx="2"
        fill="none" stroke="url(#goldGradD)" strokeWidth="1.4" filter="url(#goldGlow)" />

      {/* Stopper ball */}
      <ellipse cx="36" cy="3" rx="7" ry="3"
        fill="none" stroke="url(#goldGradD)" strokeWidth="1.4" filter="url(#goldGlow)" />

      {/* Left-side highlight shine */}
      <path d="M24 36 Q26 52 25 65" fill="none" stroke="#E8D48B" strokeWidth="0.7" opacity="0.3" />
      <path d="M30 20 Q31 28 30 36" fill="none" stroke="#E8D48B" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}

function generateBlend(openBottles, blendType, complexity) {
  const eligible = openBottles.filter(b => blendType.tiers.includes(b.rarity));
  if (eligible.length === 0) return null;

  const count = blendType.id === 'marriage'
    ? Math.min(eligible.length, 5)
    : Math.min(eligible.length, complexity > 50 ? 3 : 2);

  const factor = complexity / 100;
  const sorted = [...eligible].sort((a, b) => (b.proof || 90) - (a.proof || 90));
  const selected = factor > 0.5 ? sorted.slice(0, count) : sorted.slice(-count);

  // Assign volumes based on estimated_volume
  let items = selected.map(bottle => {
    const vol = VOLUME_MAP[bottle.estimated_volume || 'Full'];
    const weight = factor > 0.5 ? (bottle.proof || 90) : (200 - (bottle.proof || 90));
    return { bottle, weight: weight + Math.random() * 10, totalVol: vol };
  });

  const totalWeight = items.reduce((s, i) => s + i.weight, 0);
  items = items.map(i => ({ ...i, ratio: i.weight / totalWeight }));

  // Target total batch = 750ml
  const batchMl = 750;
  items = items.map(i => ({
    ...i,
    ml: Math.round(i.ratio * batchMl),
    oz: parseFloat((i.ratio * batchMl / 29.574).toFixed(1)),
    percentage: Math.round(i.ratio * 100),
  }));

  // Fix rounding
  const totalPct = items.reduce((s, i) => s + i.percentage, 0);
  items[0].percentage += (100 - totalPct);

  // Marrying time: more tiers/complexity = longer
  const tierCount = [...new Set(items.map(i => i.bottle.rarity))].length;
  const minDays = 7 + tierCount * 7;
  const maxDays = minDays + Math.round(complexity * 0.3);

  return { items, marryingTime: `${minDays}–${maxDays} days`, blendType };
}

function RecipeCard({ result, onSave, onRegenerate }) {
  const totalOz = result.items.reduce((s, i) => s + i.oz, 0).toFixed(1);
  return (
    <motion.div
      key={result.blendType.id + result.items.length}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="border border-border rounded-md overflow-hidden"
      style={{ background: 'rgba(212,175,55,0.03)' }}
    >
      {/* Card header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">Recipe Card</p>
          <h3 className="font-heading text-lg text-foreground mt-0.5">{result.blendType.label}</h3>
        </div>
        <button onClick={onRegenerate} className="text-muted-foreground hover:text-primary transition-colors p-1">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Ratios */}
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
                {item.percentage}% · {item.bottle.rarity} {item.bottle.proof ? `· ${item.bottle.proof}°` : ''}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total & Marrying */}
      <div className="px-5 pb-5 space-y-3">
        <div className="flex justify-between text-xs font-body pt-3 border-t border-border">
          <span className="text-muted-foreground uppercase tracking-widest">Batch Total</span>
          <span className="text-foreground">{totalOz} oz · 750ml</span>
        </div>
        <div className="flex justify-between text-xs font-body">
          <span className="text-muted-foreground uppercase tracking-widest">Marrying Time</span>
          <span style={{ color: '#D4AF37' }}>{result.marryingTime}</span>
        </div>

        <Button onClick={onSave} className="w-full gold-btn mt-2 text-xs uppercase tracking-widest font-body">
          <Save className="w-4 h-4 mr-2" />
          Save to Library
        </Button>
      </div>
    </motion.div>
  );
}

export default function Alchemist() {
  const [complexity, setComplexity] = useState([50]);
  const [selectedType, setSelectedType] = useState('core');
  const [blend, setBlend] = useState(null);
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
      toast.success('Infinity blend saved to your Library.');
    },
  });

  const openBottles = bottles.filter(b => b.status === 'Open' && !b.is_infinity_blend);
  const [decanterFill, setDecanterFill] = useState(0);

  const handleGenerate = () => {
    const type = BLEND_TYPES.find(t => t.id === selectedType);
    const result = generateBlend(openBottles, type, complexity[0]);
    if (!result) {
      toast.error(`No open ${type.tiers.join('/')} bottles available.`);
      return;
    }
    setBlend(result);
    // Animate fill to a level based on complexity (0.4 – 0.9)
    setDecanterFill(0.4 + (complexity[0] / 100) * 0.5);
  };

  const handleSave = () => {
    if (!blend) return;
    const names = blend.items.map(i => i.bottle.bottle_name).join(' + ');
    saveMutation.mutate({
      bottle_name: `Infinity: ${names}`,
      distillery: 'Custom Blend',
      notes: `${blend.blendType.label} · ${blend.items.map(i => `${i.oz}oz ${i.bottle.bottle_name}`).join(', ')} · Marry ${blend.marryingTime}`,
      status: 'Open',
      estimated_volume: 'Full',
      rarity: 'Premier',
      is_infinity_blend: true,
    });
  };

  // Idle fill level based on open bottles (before a blend is composed)
  const idleFill = Math.min(0.35, openBottles.length / 6 * 0.35);

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] font-body mb-1" style={{ color: '#D4AF37' }}>
          Moxie Reserve
        </p>
        <h1 className="font-heading text-3xl text-foreground">The Alchemist</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          Infinity bottle blending curator.
        </p>
      </div>

      {/* Decanter visual */}
      <div className="flex flex-col items-center py-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <DecanterSvg fillLevel={blend ? decanterFill : idleFill} animated={!!blend} />
        </motion.div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body mt-1">
          {openBottles.length} open expression{openBottles.length !== 1 ? 's' : ''} available
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
              return (
                <button
                  key={type.id}
                  onClick={() => { if (!locked) setSelectedType(type.id); }}
                  className={`relative p-3 rounded-md border text-left transition-all duration-200 ${
                    active
                      ? 'border-primary/60 bg-primary/5'
                      : locked
                        ? 'border-border opacity-50 cursor-not-allowed'
                        : 'border-border hover:border-border/80'
                  }`}
                >
                  {locked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                  <p className={`font-body text-xs font-medium uppercase tracking-wider ${active ? 'text-primary' : 'text-foreground'}`}>
                    {type.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-body mt-0.5 leading-snug">{type.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Premium upsell for locked types */}
          {(selectedType === 'vestige' || selectedType === 'marriage') && !isPremium && (
            <div className="mb-4 p-3 border border-primary/20 rounded-md flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-body">Unlock Vestige & Complex Marriage</p>
              <Link to="/settings">
                <Button size="sm" className="gold-btn text-[10px] uppercase tracking-widest font-body h-7 px-3">
                  Upgrade
                </Button>
              </Link>
            </div>
          )}

          {/* Complexity Slider */}
          <div className="border border-border rounded-md p-4 mb-5" style={{ background: 'rgba(255,255,255,0.01)' }}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">Smooth</span>
              <span className="text-[10px] uppercase tracking-widest font-body font-medium" style={{ color: '#D4AF37' }}>Complexity · {complexity[0]}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">Bold</span>
            </div>
            <Slider value={complexity} onValueChange={setComplexity} min={0} max={100} step={1} />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={BLEND_TYPES.find(t => t.id === selectedType)?.premium && !isPremium}
            className="w-full gold-btn text-xs uppercase tracking-widest font-body mb-6"
          >
            Compose Blend
          </Button>

          {/* Recipe Card */}
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
    </div>
  );
}