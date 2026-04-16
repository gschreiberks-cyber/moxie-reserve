import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Lock, FlaskConical, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePremium } from '@/hooks/usePremium';
import { motion, AnimatePresence } from 'framer-motion';

function generateBlend(openBottles, complexity) {
  if (openBottles.length < 2) return null;

  // Complexity 0 = smooth (fewer bottles, higher proof gets less), 100 = bold (more bottles, higher proof gets more)
  const factor = complexity / 100;
  const count = Math.max(2, Math.min(openBottles.length, Math.round(2 + factor * 3)));
  
  // Sort by proof, pick bottles based on complexity
  const sorted = [...openBottles].sort((a, b) => (b.proof || 90) - (a.proof || 90));
  const selected = factor > 0.5
    ? sorted.slice(0, count)
    : sorted.slice(-count);

  // Generate weighted ratios
  let ratios = selected.map((b, i) => {
    const base = factor > 0.5
      ? (b.proof || 90) * (1 + factor * 0.5)
      : 100 / (1 + (b.proof || 90) * 0.005);
    return { bottle: b, weight: base + Math.random() * 10 };
  });

  const totalWeight = ratios.reduce((s, r) => s + r.weight, 0);
  ratios = ratios.map(r => ({
    ...r,
    percentage: Math.round((r.weight / totalWeight) * 100),
  }));

  // Ensure percentages add to 100
  const diff = 100 - ratios.reduce((s, r) => s + r.percentage, 0);
  ratios[0].percentage += diff;

  return ratios;
}

function BlendResult({ blend }) {
  return (
    <div className="space-y-3">
      {blend.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-center gap-4"
        >
          <div className="w-14 text-right">
            <span className="font-heading text-2xl text-primary">{item.percentage}</span>
            <span className="text-xs text-muted-foreground">%</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className="flex-1">
            <p className="font-heading text-sm text-foreground">{item.bottle.bottle_name}</p>
            <p className="text-[11px] text-muted-foreground font-body">
              {item.bottle.distillery} {item.bottle.proof ? `· ${item.bottle.proof}°` : ''}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Alchemist() {
  const [complexity, setComplexity] = useState([50]);
  const [blend, setBlend] = useState(null);
  const { isPremium } = usePremium();

  const { data: bottles = [] } = useQuery({
    queryKey: ['bottles'],
    queryFn: () => base44.entities.UserBottle.list(),
  });

  const openBottles = bottles.filter(b => b.status === 'Open');

  const handleGenerate = () => {
    const result = generateBlend(openBottles, complexity[0]);
    setBlend(result);
  };

  if (!isPremium) {
    return (
      <div className="px-4 pt-6 max-w-lg mx-auto">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-body mb-1">
            Moxie Reserve
          </p>
          <h1 className="font-heading text-3xl text-foreground">The Alchemist</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center mb-6">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-heading text-2xl text-foreground mb-2">Premium Feature</h3>
          <p className="text-muted-foreground font-body text-sm max-w-xs mb-6">
            The Alchemist is an exclusive feature for Premium members. Unlock infinity bottle blending intelligence.
          </p>
          <Link to="/settings">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs uppercase tracking-widest">
              Unlock Premium
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-body mb-1">
          Moxie Reserve
        </p>
        <h1 className="font-heading text-3xl text-foreground">The Alchemist</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          Infinity bottle blending curator. {openBottles.length} open bottle{openBottles.length !== 1 ? 's' : ''} available.
        </p>
      </div>

      {openBottles.length < 2 ? (
        <div className="text-center py-16 border border-border rounded-md bg-card">
          <FlaskConical className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-body text-sm">
            Mark at least 2 bottles as "Open" in your Library to begin blending.
          </p>
          <Link to="/">
            <Button variant="outline" className="mt-4 border-border text-xs uppercase tracking-widest font-body">
              Go to Library
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Complexity Slider */}
          <div className="bg-card border border-border rounded-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-body">Smooth</span>
              <span className="text-xs uppercase tracking-widest text-primary font-body font-medium">
                Complexity
              </span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-body">Bold</span>
            </div>
            <Slider
              value={complexity}
              onValueChange={setComplexity}
              min={0}
              max={100}
              step={1}
              className="mb-2"
            />
          </div>

          <Button
            onClick={handleGenerate}
            className="w-full bg-primary text-primary-foreground text-xs uppercase tracking-widest font-body mb-8"
          >
            <FlaskConical className="w-4 h-4 mr-2" />
            Generate Blend
          </Button>

          {/* Result */}
          <AnimatePresence mode="wait">
            {blend && (
              <motion.div
                key={JSON.stringify(blend)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-card border border-border rounded-md p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-lg text-foreground">Your Blend</h3>
                  <button
                    onClick={handleGenerate}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <BlendResult blend={blend} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}