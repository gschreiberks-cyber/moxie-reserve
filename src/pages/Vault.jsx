import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

function VaultForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    bottle_name: '', distillery: '', estimated_price: '', priority: 'Medium', notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      estimated_price: form.estimated_price ? Number(form.estimated_price) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card border border-border rounded-t-xl sm:rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl text-foreground">Add to Vault</h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Bottle Name *</Label>
            <Input
              value={form.bottle_name}
              onChange={(e) => setForm(p => ({ ...p, bottle_name: e.target.value }))}
              required
              className="mt-1 bg-input border-border"
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Distillery</Label>
            <Input
              value={form.distillery}
              onChange={(e) => setForm(p => ({ ...p, distillery: e.target.value }))}
              className="mt-1 bg-input border-border"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Est. Price</Label>
              <Input
                type="number"
                value={form.estimated_price}
                onChange={(e) => setForm(p => ({ ...p, estimated_price: e.target.value }))}
                className="mt-1 bg-input border-border"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm(p => ({ ...p, priority: v }))}>
                <SelectTrigger className="mt-1 bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 border-border">Cancel</Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground">Add to Vault</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const priorityColors = {
  High: 'text-primary',
  Medium: 'text-accent',
  Low: 'text-muted-foreground',
};

export default function Vault() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => base44.entities.WishlistBottle.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.WishlistBottle.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.WishlistBottle.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-body mb-1">
          Moxie Reserve
        </p>
        <h1 className="font-heading text-3xl text-foreground">The Vault</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          Bottles you desire to acquire.
        </p>
      </div>

      <Button
        onClick={() => setShowForm(true)}
        className="w-full mb-6 bg-primary text-primary-foreground text-xs uppercase tracking-widest font-body"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add to Vault
      </Button>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-16 bg-card border border-border rounded-md animate-pulse" />
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground font-body text-sm">Your vault is empty.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {wishlist.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-md group"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-base text-foreground truncate">{item.bottle_name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-body">
                    {item.distillery && <span>{item.distillery}</span>}
                    {item.estimated_price && <span>${item.estimated_price}</span>}
                    <span className={priorityColors[item.priority]}>{item.priority}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(item.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {showForm && <VaultForm onSubmit={(data) => createMutation.mutate(data)} onCancel={() => setShowForm(false)} />}
    </div>
  );
}