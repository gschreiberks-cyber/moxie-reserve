import React from 'react';

// Approximate mash bill profiles by distillery / bottle name keywords
const MASH_PROFILES = [
  { match: /weller|van winkle|pappy|w\.l\. weller/i,         corn: 70, rye: 16, barley: 14 },
  { match: /buffalo trace|eagle rare|e\.h\. taylor|blanton/i, corn: 75, rye: 10, barley: 15 },
  { match: /four roses/i,                                      corn: 75, rye: 20, barley: 5  },
  { match: /wild turkey|russell/i,                             corn: 75, rye: 13, barley: 12 },
  { match: /booker|knob creek|jim beam|basil hayden/i,         corn: 77, rye: 13, barley: 10 },
  { match: /maker|maker's/i,                                   corn: 70, rye: 14, barley: 16 },
  { match: /woodford|old forester/i,                           corn: 72, rye: 18, barley: 10 },
  { match: /michter/i,                                         corn: 78, rye: 10, barley: 12 },
  { match: /elijah craig|heaven hill|larceny/i,                corn: 78, rye: 10, barley: 12 },
  { match: /handy|sazerac|stagg|george t/i,                    corn: 75, rye: 15, barley: 10 },
];

const DEFAULT_PROFILE = { corn: 74, rye: 14, barley: 12 };

function getProfile(bottleName = '') {
  const match = MASH_PROFILES.find(p => p.match.test(bottleName));
  return match || DEFAULT_PROFILE;
}

export default function MashBill({ items }) {
  if (!items || items.length === 0) return null;

  // Weighted average by oz ratio
  let totalCorn = 0, totalRye = 0, totalBarley = 0;
  items.forEach(item => {
    const p = getProfile(item.bottle?.bottle_name);
    totalCorn   += p.corn   * item.ratio;
    totalRye    += p.rye    * item.ratio;
    totalBarley += p.barley * item.ratio;
  });

  const corn   = Math.round(totalCorn);
  const rye    = Math.round(totalRye);
  const barley = Math.round(totalBarley);

  const bars = [
    { label: 'Corn',   value: corn,   color: '#D4AF37' },
    { label: 'Rye',    value: rye,    color: '#B87333' },
    { label: 'Barley', value: barley, color: '#A9A9A9' },
  ];

  return (
    <div className="pt-3 border-t border-border space-y-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">Est. Mash Bill Composition</p>
      <div className="space-y-2">
        {bars.map(bar => (
          <div key={bar.label} className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider font-body text-muted-foreground w-10 shrink-0">{bar.label}</span>
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${bar.value}%`, background: bar.color, boxShadow: `0 0 6px ${bar.color}55` }}
              />
            </div>
            <span className="text-[10px] font-body text-muted-foreground w-8 text-right shrink-0">{bar.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}