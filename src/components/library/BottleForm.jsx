import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

const defaultBottle = {
  distillery: '',
  bottle_name: '',
  age: '',
  proof: '',
  purchase_price: '',
  status: 'Closed',
  rarity: 'Core',
  notes: '',
};

export default function BottleForm({ bottle, onSubmit, onCancel }) {
  const [form, setForm] = useState(bottle || defaultBottle);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      age: form.age ? Number(form.age) : undefined,
      proof: form.proof ? Number(form.proof) : undefined,
      purchase_price: form.purchase_price ? Number(form.purchase_price) : undefined,
    });
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card border border-border rounded-t-xl sm:rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl text-foreground">
            {bottle ? 'Edit Bottle' : 'Bespoke Entry'}
          </h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Bottle Name *</Label>
            <Input
              value={form.bottle_name}
              onChange={(e) => update('bottle_name', e.target.value)}
              placeholder="e.g. Blanton's Single Barrel"
              required
              className="mt-1 bg-input border-border"
            />
          </div>

          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Distillery</Label>
            <Input
              value={form.distillery}
              onChange={(e) => update('distillery', e.target.value)}
              placeholder="e.g. Buffalo Trace"
              className="mt-1 bg-input border-border"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Age</Label>
              <Input
                type="number"
                value={form.age}
                onChange={(e) => update('age', e.target.value)}
                placeholder="yrs"
                className="mt-1 bg-input border-border"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Proof</Label>
              <Input
                type="number"
                value={form.proof}
                onChange={(e) => update('proof', e.target.value)}
                placeholder="°"
                className="mt-1 bg-input border-border"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Price</Label>
              <Input
                type="number"
                value={form.purchase_price}
                onChange={(e) => update('purchase_price', e.target.value)}
                placeholder="$"
                className="mt-1 bg-input border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Status</Label>
              <Select value={form.status} onValueChange={(v) => update('status', v)}>
                <SelectTrigger className="mt-1 bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Rarity</Label>
              <Select value={form.rarity} onValueChange={(v) => update('rarity', v)}>
                <SelectTrigger className="mt-1 bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Core">Core</SelectItem>
                  <SelectItem value="Premier">Premier</SelectItem>
                  <SelectItem value="Vestige">Vestige</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body">Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Tasting notes, memories..."
              className="mt-1 bg-input border-border h-20"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 border-border">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              {bottle ? 'Update' : 'Add to Library'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}