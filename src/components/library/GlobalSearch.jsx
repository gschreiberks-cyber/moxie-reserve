import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const WHISKEY_DB = [
  { bottle_name: "Blanton's Single Barrel", distillery: "Buffalo Trace", proof: 93, rarity: "Premier" },
  { bottle_name: "Pappy Van Winkle 15yr", distillery: "Old Rip Van Winkle", age: 15, proof: 107, rarity: "Vestige" },
  { bottle_name: "Eagle Rare 10yr", distillery: "Buffalo Trace", age: 10, proof: 90, rarity: "Core" },
  { bottle_name: "Weller Special Reserve", distillery: "Buffalo Trace", proof: 90, rarity: "Core" },
  { bottle_name: "Maker's Mark", distillery: "Maker's Mark", proof: 90, rarity: "Core" },
  { bottle_name: "Woodford Reserve", distillery: "Brown-Forman", proof: 90.4, rarity: "Core" },
  { bottle_name: "Wild Turkey 101", distillery: "Wild Turkey", proof: 101, rarity: "Core" },
  { bottle_name: "Four Roses Single Barrel", distillery: "Four Roses", proof: 100, rarity: "Premier" },
  { bottle_name: "Booker's Bourbon", distillery: "Jim Beam", proof: 125.8, rarity: "Premier" },
  { bottle_name: "George T. Stagg", distillery: "Buffalo Trace", proof: 130, rarity: "Vestige" },
  { bottle_name: "Colonel E.H. Taylor Small Batch", distillery: "Buffalo Trace", proof: 100, rarity: "Premier" },
  { bottle_name: "Elijah Craig Barrel Proof", distillery: "Heaven Hill", proof: 120, rarity: "Premier" },
  { bottle_name: "Russell's Reserve 10yr", distillery: "Wild Turkey", age: 10, proof: 90, rarity: "Core" },
  { bottle_name: "Michter's US-1 Bourbon", distillery: "Michter's", proof: 91.4, rarity: "Premier" },
  { bottle_name: "Old Forester 1920", distillery: "Brown-Forman", proof: 115, rarity: "Premier" },
  { bottle_name: "Knob Creek 12yr", distillery: "Jim Beam", age: 12, proof: 100, rarity: "Core" },
  { bottle_name: "Weller 12yr", distillery: "Buffalo Trace", age: 12, proof: 90, rarity: "Premier" },
  { bottle_name: "Laphroaig 10yr", distillery: "Laphroaig", age: 10, proof: 86, rarity: "Core" },
  { bottle_name: "Macallan 18yr", distillery: "The Macallan", age: 18, proof: 86, rarity: "Vestige" },
  { bottle_name: "Lagavulin 16yr", distillery: "Lagavulin", age: 16, proof: 86, rarity: "Premier" },
];

export default function GlobalSearch({ onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }
    const q = value.toLowerCase();
    const matched = WHISKEY_DB.filter(
      b => b.bottle_name.toLowerCase().includes(q) || b.distillery.toLowerCase().includes(q)
    );
    setResults(matched);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card border border-border rounded-xl p-4 mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search whiskeys..."
            className="pl-10 bg-input border-border"
          />
        </div>

        {results.length > 0 && (
          <div className="mt-3 max-h-64 overflow-y-auto space-y-1">
            {results.map((bottle, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(bottle)}
                className="w-full text-left p-3 rounded-md hover:bg-secondary transition-colors"
              >
                <p className="font-heading text-sm text-foreground">{bottle.bottle_name}</p>
                <p className="text-xs text-muted-foreground font-body">{bottle.distillery} · {bottle.proof}°</p>
              </button>
            ))}
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <p className="text-center text-muted-foreground text-sm mt-4 py-4">
            No results. Try a bespoke entry instead.
          </p>
        )}

        <div className="mt-3 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="border-border text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}