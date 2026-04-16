import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import BottleCard from '@/components/library/BottleCard';
import BottleForm from '@/components/library/BottleForm';
import GlobalSearch from '@/components/library/GlobalSearch';
import PremiumGate from '@/components/common/PremiumGate';
import { usePremium } from '@/hooks/usePremium';

export default function Library() {
  const [showForm, setShowForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [editingBottle, setEditingBottle] = useState(null);
  const [filter, setFilter] = useState('All');
  const [showCreations, setShowCreations] = useState(false);
  const queryClient = useQueryClient();
  const { isPremium } = usePremium();

  const { data: bottles = [], isLoading } = useQuery({
    queryKey: ['bottles'],
    queryFn: () => base44.entities.UserBottle.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.UserBottle.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bottles'] });
      setShowForm(false);
      setShowSearch(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.UserBottle.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bottles'] });
      setEditingBottle(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.UserBottle.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bottles'] }),
  });

  const handleSubmit = (data) => {
    if (editingBottle) {
      updateMutation.mutate({ id: editingBottle.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (bottle) => {
    setEditingBottle(bottle);
    setShowForm(true);
  };

  const handleToggleStatus = (bottle) => {
    updateMutation.mutate({
      id: bottle.id,
      data: { status: bottle.status === 'Open' ? 'Closed' : 'Open' },
    });
  };

  const handleSearchSelect = (bottle) => {
    setShowSearch(false);
    setEditingBottle(null);
    setShowForm(true);
    setEditingBottle(null);
    // Pre-fill form with selected bottle data
    setTimeout(() => {
      setEditingBottle({ ...bottle, id: undefined });
      setShowForm(true);
    }, 0);
  };

  const mainBottles = bottles.filter(b => !b.is_infinity_blend);
  const infiniteBottles = bottles.filter(b => b.is_infinity_blend);

  const filteredBottles = showCreations
    ? infiniteBottles
    : filter === 'All'
      ? mainBottles
      : filter === 'Open' || filter === 'Closed'
        ? mainBottles.filter(b => b.status === filter)
        : mainBottles.filter(b => b.rarity === filter);

  const canAdd = isPremium || mainBottles.length < 10;

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] font-body mb-1" style={{ color: '#D4AF37' }}>
          Moxie Reserve
        </p>
        <h1 className="font-heading text-3xl text-foreground">The Library</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          {bottles.length} bottle{bottles.length !== 1 ? 's' : ''} in your collection
          {!isPremium && <span className="text-primary"> · {Math.max(0, 10 - bottles.length)} free remaining</span>}
        </p>
      </div>

      {/* My Creations / Library toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowCreations(false)}
          className="px-4 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-body transition-all"
          style={!showCreations
            ? { background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }
            : { background: 'hsl(var(--secondary))', color: 'hsl(var(--secondary-foreground))' }
          }
        >
          My Library
        </button>
        <button
          onClick={() => setShowCreations(true)}
          className="px-4 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-body transition-all"
          style={showCreations
            ? { background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }
            : { background: 'hsl(var(--secondary))', color: 'hsl(var(--secondary-foreground))' }
          }
        >
          My Creations {infiniteBottles.length > 0 && `(${infiniteBottles.length})`}
        </button>
      </div>

      {/* Filters — only show on main library view */}
      {!showCreations && <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {[
          { label: 'All',     activeStyle: { background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' } },
          { label: 'Open',    activeStyle: { background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' } },
          { label: 'Closed',  activeStyle: { background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' } },
          { label: 'Core',    activeStyle: { background: '#A9A9A9', color: '#0B0B0B' } },
          { label: 'Premier', activeStyle: { background: '#D4AF37', color: '#0B0B0B' } },
          { label: 'Vestige', activeStyle: { background: '#B87333', color: '#0B0B0B' } },
        ].map(({ label, activeStyle }) => (
          <button
            key={label}
            onClick={() => setFilter(label)}
            className="px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-body whitespace-nowrap transition-all"
            style={
              filter === label
                ? activeStyle
                : { background: 'hsl(var(--secondary))', color: 'hsl(var(--secondary-foreground))' }
            }
          >
            {label}
          </button>
        ))}
      </div>}

      {/* Actions */}
      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => setShowSearch(true)}
          variant="outline"
          className="flex-1 border-border text-xs uppercase tracking-widest font-body"
          disabled={!canAdd}
        >
          <Search className="w-4 h-4 mr-2" />
          Search Database
        </Button>
        <Button
          onClick={() => { setEditingBottle(null); setShowForm(true); }}
          className="flex-1 gold-btn text-xs uppercase tracking-widest font-body"
          disabled={!canAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Bespoke Entry
        </Button>
      </div>

      {/* Bottle List */}
      <PremiumGate bottleCount={bottles.length} isPremium={isPremium}>
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 bg-card border border-border rounded-md animate-pulse" />
            ))}
          </div>
        ) : filteredBottles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-body text-sm">
              {bottles.length === 0 ? 'Your library awaits its first entry.' : 'No bottles match this filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredBottles.map(bottle => (
                <motion.div
                  key={bottle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <BottleCard
                    bottle={bottle}
                    onEdit={handleEdit}
                    onDelete={(b) => deleteMutation.mutate(b.id)}
                    onToggleStatus={handleToggleStatus}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </PremiumGate>

      {/* Modals */}
      {showSearch && (
        <GlobalSearch
          onSelect={handleSearchSelect}
          onClose={() => setShowSearch(false)}
        />
      )}

      {showForm && (
        <BottleForm
          bottle={editingBottle?.id ? editingBottle : (editingBottle || null)}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingBottle(null); }}
        />
      )}
    </div>
  );
}