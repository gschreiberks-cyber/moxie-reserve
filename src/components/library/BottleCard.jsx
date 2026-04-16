import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const rarityStyles = {
  Core:    { color: '#A9A9A9', border: 'rgba(169,169,169,0.25)', bg: 'rgba(169,169,169,0.06)' },
  Premier: { color: '#D4AF37', border: 'rgba(212,175,55,0.30)',  bg: 'rgba(212,175,55,0.06)'  },
  Vestige: { color: '#B87333', border: 'rgba(184,115,51,0.30)',  bg: 'rgba(184,115,51,0.06)'  },
};

export default function BottleCard({ bottle, onEdit, onDelete, onToggleStatus }) {
  return (
    <div className="group border border-border rounded-md p-4 bg-card hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {(() => {
              const s = rarityStyles[bottle.rarity] || rarityStyles.Core;
              return (
                <span
                  className="text-[10px] uppercase tracking-widest font-body px-2 py-0.5 rounded border"
                  style={{ color: s.color, borderColor: s.border, background: s.bg }}
                >
                  {bottle.rarity || 'Core'}
                </span>
              );
            })()}
            <span className={`w-2 h-2 rounded-full ${bottle.status === 'Open' ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
          </div>
          <h3 className="font-heading text-lg text-foreground truncate mt-2">
            {bottle.bottle_name}
          </h3>
          {bottle.distillery && (
            <p className="text-xs text-muted-foreground font-body tracking-wide uppercase mt-0.5">
              {bottle.distillery}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-body">
            {bottle.age && <span>{bottle.age}yr</span>}
            {bottle.proof && <span>{bottle.proof}°</span>}
            {bottle.purchase_price && <span>${bottle.purchase_price}</span>}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem onClick={() => onToggleStatus(bottle)}>
              Mark as {bottle.status === 'Open' ? 'Closed' : 'Open'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(bottle)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(bottle)} className="text-destructive">
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}