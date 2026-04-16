import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PremiumGate({ bottleCount, isPremium, children }) {
  if (isPremium || bottleCount < 10) return children;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center mb-6">
        <Lock className="w-7 h-7 text-primary" />
      </div>
      <h3 className="font-heading text-2xl text-foreground mb-2">Library Limit Reached</h3>
      <p className="text-muted-foreground font-body text-sm max-w-xs mb-6">
        Your complimentary tier allows 10 bottles. Upgrade to Premium for Life for unlimited access.
      </p>
      <Link to="/settings">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs uppercase tracking-widest">
          Unlock Premium
        </Button>
      </Link>
    </div>
  );
}