import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Crown, RotateCcw, Shield, FileText, CheckCircle } from 'lucide-react';
import { usePremium } from '@/hooks/usePremium';
import { toast } from 'sonner';

export default function Settings() {
  const { isPremium, activatePremium, restorePurchase } = usePremium();
  const [restoring, setRestoring] = useState(false);

  const handleRestore = async () => {
    setRestoring(true);
    const restored = await restorePurchase();
    setRestoring(false);
    if (restored) {
      toast.success('Premium status restored.');
    } else {
      toast.error('No previous purchase found.');
    }
  };

  const handleUpgrade = async () => {
    await activatePremium();
    toast.success('Welcome to Premium for Life.');
  };

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] font-body mb-1" style={{ color: '#D4AF37' }}>
          Moxie Reserve
        </p>
        <h1 className="font-heading text-3xl text-foreground">Settings</h1>
      </div>

      {/* Premium Status */}
      <div className="bg-card border border-border rounded-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-lg text-foreground">Membership</h3>
        </div>
        {isPremium ? (
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary border-primary/30 text-xs uppercase tracking-widest font-body">
              Premium for Life
            </Badge>
            <CheckCircle className="w-4 h-4 text-primary" />
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground font-body mb-4">
              You are on the complimentary tier (10 bottles). Upgrade to unlock unlimited bottles and The Alchemist.
            </p>
            <Button
              onClick={handleUpgrade}
              className="w-full gold-btn text-xs uppercase tracking-widest font-body"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium for Life
            </Button>
          </div>
        )}
      </div>

      {/* Restore Purchase */}
      <div className="bg-card border border-border rounded-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-heading text-lg text-foreground">Restore Purchase</h3>
        </div>
        <p className="text-sm text-muted-foreground font-body mb-4">
          If you've previously upgraded, restore your purchase here.
        </p>
        <Button
          onClick={handleRestore}
          disabled={restoring}
          variant="outline"
          className="w-full border-border text-xs uppercase tracking-widest font-body"
        >
          {restoring ? 'Restoring...' : 'Restore Purchase'}
        </Button>
      </div>

      <Separator className="my-6 bg-border" />

      {/* Legal */}
      <div className="space-y-3 mb-8">
        <button
          onClick={() => window.open('#privacy', '_blank')}
          className="flex items-center gap-3 w-full p-4 bg-card border border-border rounded-md hover:border-primary/30 transition-colors"
        >
          <Shield className="w-4 h-4 text-muted-foreground" />
          <span className="font-body text-sm text-foreground">Privacy Policy</span>
        </button>
        <button
          onClick={() => window.open('#terms', '_blank')}
          className="flex items-center gap-3 w-full p-4 bg-card border border-border rounded-md hover:border-primary/30 transition-colors"
        >
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="font-body text-sm text-foreground">Terms of Service</span>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="font-heading text-lg text-primary mb-1">Moxie Reserve</p>
        <p className="text-[11px] text-muted-foreground font-body tracking-wider">
          No ads. No social tracking. Your collection, your privacy.
        </p>
      </div>
    </div>
  );
}