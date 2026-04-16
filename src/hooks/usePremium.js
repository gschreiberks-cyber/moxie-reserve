import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const user = await base44.auth.me();
      setIsPremium(user?.premium_for_life === true);
      setLoading(false);
    };
    check();
  }, []);

  const activatePremium = async () => {
    await base44.auth.updateMe({ premium_for_life: true });
    setIsPremium(true);
  };

  const restorePurchase = async () => {
    const user = await base44.auth.me();
    setIsPremium(user?.premium_for_life === true);
    return user?.premium_for_life === true;
  };

  return { isPremium, loading, activatePremium, restorePurchase };
}