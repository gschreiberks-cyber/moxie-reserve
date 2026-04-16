import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Telescope } from 'lucide-react';

const HORIZON_RELEASES = [
  { year: 2026, month: 'January',   bottle_name: 'Old Forester Birthday Bourbon',     msrp: 60,  secondary: 180, notes: 'Annual birthday release, limited allocation' },
  { year: 2026, month: 'March',     bottle_name: "Jefferson's Ocean Voyage",           msrp: 55,  secondary: 130, notes: 'Sea-aged expression, rotating voyages' },
  { year: 2026, month: 'May',       bottle_name: 'Four Roses Limited Small Batch',     msrp: 80,  secondary: 200, notes: 'Spring limited edition, retailer select' },
  { year: 2026, month: 'June',      bottle_name: "Blanton's Straight from the Barrel", msrp: 120, secondary: 320, notes: 'Japanese export, periodic US drops' },
  { year: 2026, month: 'August',    bottle_name: "Maker's Mark Private Select",        msrp: 110, secondary: 180, notes: 'Annual stave-customized batch release' },
  { year: 2026, month: 'September', bottle_name: "Maker's Mark Cellar Aged",           msrp: 130, secondary: 220, notes: 'Fall release, store pick season opens' },
  { year: 2026, month: 'October',   bottle_name: 'William Larue Weller',               msrp: 99,  secondary: 900, notes: 'BTAC — most allocated of the collection' },
  { year: 2026, month: 'October',   bottle_name: 'Thomas H. Handy Sazerac',            msrp: 99,  secondary: 700, notes: 'BTAC — uncut rye, high demand' },
  { year: 2026, month: 'November',  bottle_name: 'Buffalo Trace Antique Collection',   msrp: 99,  secondary: 800, notes: 'BTAC flagship drop — George T. Stagg, etc.' },
  { year: 2026, month: 'November',  bottle_name: 'Pappy Van Winkle Family Reserve',    msrp: 299, secondary: 3500, notes: 'Highly allocated, November lottery season' },
  { year: 2026, month: 'December',  bottle_name: 'Elijah Craig Barrel Proof Batch C',  msrp: 65,  secondary: 140, notes: 'Third batch of the year, holiday shelf hits' },
];

// Group by "Month Year"
function groupByMonth(releases) {
  const groups = {};
  releases.forEach(r => {
    const key = `${r.month} ${r.year}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });
  return groups;
}

export default function HorizonModal({ onAdd, onClose }) {
  const [added, setAdded] = useState(new Set());
  const [openMonth, setOpenMonth] = useState(null);
  const groups = groupByMonth(HORIZON_RELEASES);

  const handleAdd = (release, key) => {
    onAdd(release);
    setAdded(prev => new Set([...prev, key]));
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
              <p className="text-[10px] text-muted-foreground font-body uppercase tracking-widest">Predicted Annual Releases · 2026</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accordion list */}
        <div className="overflow-y-auto px-4 py-3 space-y-1" style={{ maxHeight: 'calc(85vh - 72px)' }}>
          {Object.entries(groups).map(([monthLabel, releases]) => {
            const isOpen = openMonth === monthLabel;
            return (
              <div key={monthLabel} className="border border-border rounded-md overflow-hidden">
                {/* Month header */}
                <button
                  onClick={() => setOpenMonth(isOpen ? null : monthLabel)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-secondary/30 transition-colors"
                >
                  <span className="text-xs uppercase tracking-widest font-body" style={{ color: '#D4AF37' }}>{monthLabel}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-body">{releases.length} release{releases.length > 1 ? 's' : ''}</span>
                    <span className="text-muted-foreground text-xs">{isOpen ? '−' : '+'}</span>
                  </div>
                </button>

                {/* Releases */}
                {isOpen && (
                  <div className="border-t border-border divide-y divide-border">
                    {releases.map((release, i) => {
                      const key = `${monthLabel}-${i}`;
                      const isAdded = added.has(key);
                      return (
                        <div key={i} className="flex items-center gap-3 px-4 py-3 bg-card/40">
                          <div className="flex-1 min-w-0">
                            <p className="font-heading text-sm text-foreground truncate">{release.bottle_name}</p>
                            <p className="text-[10px] text-muted-foreground/70 font-body mt-0.5">{release.notes}</p>
                            <div className="flex gap-3 mt-1">
                              <span className="text-[10px] font-body text-muted-foreground">MSRP <span className="text-foreground">${release.msrp}</span></span>
                              <span className="text-[10px] font-body text-muted-foreground">Secondary <span style={{ color: '#D4AF37' }}>${release.secondary.toLocaleString()}</span></span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAdd(release, key)}
                            className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                              isAdded
                                ? 'border-primary/60 bg-primary/10 text-primary'
                                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary'
                            }`}
                          >
                            {isAdded ? <span className="text-[10px] font-body">✓</span> : <Plus className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}