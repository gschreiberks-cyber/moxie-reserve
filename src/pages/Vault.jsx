import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, TrendingDown, TrendingUp, Minus, X, Calendar, Telescope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnimatePresence, motion } from 'framer-motion';

const HORIZON_RELEASES = [
  { month: 'January',   bottle_name: 'Old Forester Birthday Bourbon',        notes: 'Annual birthday release, limited allocation' },
  { month: 'March',     bottle_name: "Jefferson's Ocean Voyage",              notes: 'Sea-aged expression, rotating voyages' },
  { month: 'May',       bottle_name: 'Four Roses Limited Small Batch',        notes: 'Spring limited edition, retailer select' },
  { month: 'June',      bottle_name: "Blanton's Straight from the Barrel",    notes: 'Japanese export, periodic US drops' },
  { month: 'August',    bottle_name: "Maker's Mark Private Select",           notes: 'Annual stave-customized batch release' },
  { month: 'September', bottle_name: "Maker's Mark Cellar Aged",              notes: 'Fall release, store pick season opens' },
  { month: 'October',   bottle_name: 'William Larue Weller',                  notes: 'BTAC — most allocated of the collection' },
  { month: 'October',   bottle_name: 'Thomas H. Handy Sazerac',               notes: 'BTAC — uncut rye, high demand' },
  { month: 'November',  bottle_name: 'Buffalo Trace Antique Collection',      notes: 'BTAC flagship drop — George T. Stagg, etc.' },
  { month: 'November',  bottle_name: 'Pappy Van Winkle Family Reserve',       notes: 'Highly allocated, November lottery season' },
  { month: 'December',  bottle_name: 'Elijah Craig Barrel Proof Batch C',     notes: 'Third batch of the year, holiday shelf hits' },
];

function HorizonModal({ onAdd, onClose }) {
  const [added, setAdded] = useState(new Set());

  const handleAdd = (release, idx) => {
    onAdd(release);
    setAdded(prev => new Set([...prev, idx]));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="w-full max-w-lg bg-card border border-border rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{ maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between"
          style={{ background: 'rgba(212,175,55,0.04)' }}>
          <div className="flex items-center gap-3">
            <Telescope className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <div>
              <h2 className="font-heading text-lg text-foreground">The Horizon</h2>
              <p className="text-[10px] text-muted-foreground font-body uppercase tracking-widest">Predicted Annual Releases</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto px-4 py-3 space-y-2" style={{ maxHeight: 'calc(85vh - 72px)' }}>
          {HORIZON_RELEASES.map((release, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-md border border-border bg-card/50 hover:border-primary/20 transition-all"
            >
              <div className="w-14 shrink-0">
                <span className="text-[10px] uppercase tracking-widest font-body" style={{ color: '#D4AF37' }}>
                  {release.month}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm text-foreground truncate">{release.bottle_name}</p>
                <p className="text-[10px] text-muted-foreground/70 font-body truncate">{release.notes}</p>
              </div>
              <button
                onClick={() => handleAdd(release, idx)}
                className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                  added.has(idx)
                    ? 'border-primary/60 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary'
                }`}
              >
                {added.has(idx) ? (
                  <span className="text-[10px] font-body">✓</span>
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function PursuitForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ bottle_name: '', target_price: '', market_price: '', notes: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      target_price: form.target_price ? Number(form.target_price) : undefined,
      market_price: form.market_price ? Number(form.market_price) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-card border border-border rounded-t-xl sm:rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl text-foreground">Add to The Pursuit</h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Bottle Name *</Label>
            <Input value={form.bottle_name} onChange={(e) => setForm(p => ({ ...p, bottle_name: e.target.value }))} required className="mt-1 bg-input border-border" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Target Price</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input type="number" value={form.target_price} onChange={(e) => setForm(p => ({ ...p, target_price: e.target.value }))} className="pl-6 bg-input border-border" placeholder="0" />
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Market Price</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input type="number" value={form.market_price} onChange={(e) => setForm(p => ({ ...p, market_price: e.target.value }))} className="pl-6 bg-input border-border" placeholder="0" />
              </div>
            </div>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Hunt Notes</Label>
            <Input value={form.notes} onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))} className="mt-1 bg-input border-border" placeholder="Retailers, release dates..." />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 border-border">Cancel</Button>
            <Button type="submit" className="flex-1 gold-btn">Add to Pursuit</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function PriceDelta({ target, market }) {
  if (!target || !market) return null;
  const delta = market - target;
  if (delta > 0) return <span className="text-destructive text-xs font-body flex items-center gap-1"><TrendingUp className="w-3 h-3" />${delta} over target</span>;
  if (delta < 0) return <span className="text-green-500 text-xs font-body flex items-center gap-1"><TrendingDown className="w-3 h-3" />${Math.abs(delta)} under target</span>;
  return <span className="text-muted-foreground text-xs font-body flex items-center gap-1"><Minus className="w-3 h-3" />At target</span>;
}

export default function Vault() {
  const [showForm, setShowForm] = useState(false);
  const [showHorizon, setShowHorizon] = useState(false);
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => base44.entities.WishlistBottle.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.WishlistBottle.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['wishlist'] }); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.WishlistBottle.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  const addFromHorizon = (release) => {
    createMutation.mutate({ bottle_name: release.bottle_name, notes: `${release.month} release — ${release.notes}` });
  };

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto pb-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] font-body mb-1" style={{ color: '#D4AF37' }}>
          Moxie Reserve
        </p>
        <h1 className="font-heading text-3xl text-foreground">The Pursuit</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Your active hunt list. Track the chase.</p>
      </div>

      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-heading text-lg text-foreground">My Pursuit</h2>
        <div className="flex-1 h-px bg-border" />
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-body px-3 py-1.5 rounded-full border border-border hover:border-primary/40 hover:text-primary transition-all text-muted-foreground"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-card border border-border rounded-md animate-pulse" />)}</div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground font-body text-sm">No bottles on the pursuit yet.</p>
        </div>
      ) : (
        <div className="space-y-2 mb-8">
          <AnimatePresence>
            {wishlist.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -80 }}
                className="p-4 bg-card border border-border rounded-md group hover:border-primary/20 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-base text-foreground truncate">{item.bottle_name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-body">
                      {item.target_price && <span>Target <span className="text-foreground">${item.target_price}</span></span>}
                      {item.market_price && <span>Market <span className="text-foreground">${item.market_price}</span></span>}
                    </div>
                    <div className="mt-1.5">
                      <PriceDelta target={item.target_price} market={item.market_price} />
                    </div>
                    {item.notes && <p className="text-xs text-muted-foreground/70 mt-2 italic">{item.notes}</p>}
                  </div>
                  <button onClick={() => deleteMutation.mutate(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 ml-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Floating The Horizon Button */}
      <button
        onClick={() => setShowHorizon(true)}
        className="fixed bottom-24 right-5 flex items-center gap-2 px-4 py-3 rounded-full border border-primary/40 text-xs uppercase tracking-widest font-body text-primary shadow-lg transition-all hover:border-primary/80 z-40"
        style={{
          background: 'rgba(11,11,11,0.9)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 20px rgba(212,175,55,0.15)',
        }}
      >
        <Telescope className="w-4 h-4" />
        The Horizon
      </button>

      {/* Modals */}
      <AnimatePresence>
        {showHorizon && (
          <HorizonModal onAdd={addFromHorizon} onClose={() => setShowHorizon(false)} />
        )}
      </AnimatePresence>

      {showForm && <PursuitForm onSubmit={(data) => createMutation.mutate(data)} onCancel={() => setShowForm(false)} />}
    </div>
  );
}