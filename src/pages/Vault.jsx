import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, TrendingDown, TrendingUp, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnimatePresence, motion } from 'framer-motion';

function VaultForm({ onSubmit, onCancel }) {
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
      <div className="w-full max-w-lg bg-card border border-border rounded-t-xl sm:rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl text-foreground">Add to the Hunt</h2>
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
            <Button type="submit" className="flex-1 gold-btn">Add to Vault</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PriceDelta({ target, market }) {
  if (!target || !market) return null;
  const delta = market - target;
  const pct = Math.round((delta / target) * 100);
  if (delta > 0) return <span className="text-destructive text-xs font-body flex items-center gap-1"><TrendingUp className="w-3 h-3" />${delta} over target</span>;
  if (delta < 0) return <span className="text-green-500 text-xs font-body flex items-center gap-1"><TrendingDown className="w-3 h-3" />${Math.abs(delta)} under target</span>;
  return <span className="text-muted-foreground text-xs font-body flex items-center gap-1"><Minus className="w-3 h-3" />At target</span>;
}

export default function Vault() {
  const [showForm, setShowForm] = useState(false);
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

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] font-body mb-1" style={{ color: '#D4AF37' }}>
          Moxie Reserve
        </p>
        <h1 className="font-heading text-3xl text-foreground">The Vault</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Your active hunt list. Track the chase.</p>
      </div>

      <Button onClick={() => setShowForm(true)} className="w-full mb-6 gold-btn text-xs uppercase tracking-widest font-body">
        <Plus className="w-4 h-4 mr-2" />
        Add to the Hunt
      </Button>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-card border border-border rounded-md animate-pulse" />)}</div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground font-body text-sm">No bottles on the hunt yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
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

      {showForm && <VaultForm onSubmit={(data) => createMutation.mutate(data)} onCancel={() => setShowForm(false)} />}
    </div>
  );
}