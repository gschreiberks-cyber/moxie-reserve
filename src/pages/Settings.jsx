import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Key, RotateCcw, Shield, FileText, CheckCircle, User } from 'lucide-react';
import { usePremium } from '@/hooks/usePremium';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import LegalModal from '@/components/settings/LegalModal';

export default function Settings() {
  const { isPremium, activatePremium, restorePurchase } = usePremium();
  const [restoring, setRestoring] = useState(false);
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | null

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

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

  const joinYear = user?.created_date
    ? new Date(user.created_date).getFullYear()
    : null;

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto pb-10">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] font-body mb-1" style={{ color: '#D4AF37' }}>
          Moxie Reserve
        </p>
        <h1 className="font-heading text-3xl text-foreground">Settings</h1>
      </div>

      {/* Member Profile */}
      <div className="bg-card border border-border rounded-md p-5 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center shrink-0"
          style={{ background: 'rgba(212,175,55,0.06)' }}>
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-heading text-base text-foreground">{user?.full_name || 'Member'}</p>
          <p className="text-[10px] uppercase tracking-widest font-body text-muted-foreground mt-0.5">
            {joinYear ? `Member since ${joinYear}` : 'Moxie Reserve Member'}
          </p>
        </div>
        {isPremium && (
          <Badge className="ml-auto bg-primary/10 text-primary border-primary/30 text-[10px] uppercase tracking-widest font-body shrink-0">
            Premium
          </Badge>
        )}
      </div>

      {/* Membership */}
      <div className="bg-card border border-border rounded-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-primary" />
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
              <Key className="w-4 h-4 mr-2" />
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
          onClick={() => setLegalModal('privacy')}
          className="flex items-center gap-3 w-full p-4 bg-card border border-border rounded-md hover:border-primary/30 transition-colors"
        >
          <Shield className="w-4 h-4 text-muted-foreground" />
          <span className="font-body text-sm text-foreground">Privacy Policy</span>
        </button>
        <button
          onClick={() => setLegalModal('terms')}
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

      {/* Legal Modals */}
      <AnimatePresence>
        {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />}
      </AnimatePresence>
    </div>
  );
}