import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BookOpen, FlaskConical, Star, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePremium } from '@/hooks/usePremium';

function StatCard({ label, value, sub, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex-1 border border-border rounded-md p-4 text-center"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      <p className="font-heading text-2xl" style={{ color: '#D4AF37', textShadow: '0 0 12px rgba(212,175,55,0.35)' }}>
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body mt-1">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground/60 font-body mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function QuickLink({ to, icon: Icon, label, sub, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link
        to={to}
        className="flex items-center gap-4 p-4 border border-border rounded-md group hover:border-primary/40 transition-all duration-300"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-heading text-base text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground font-body">{sub}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>
    </motion.div>
  );
}

export default function Dashboard() {
  const { isPremium } = usePremium();

  const { data: bottles = [] } = useQuery({
    queryKey: ['bottles'],
    queryFn: () => base44.entities.UserBottle.list(),
  });

  const { data: wishlist = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => base44.entities.WishlistBottle.list(),
  });

  const totalValue = bottles.reduce((s, b) => s + (b.purchase_price || 0), 0);
  const openCount = bottles.filter(b => b.status === 'Open').length;

  return (
    <div className="px-4 pt-8 pb-4 max-w-lg mx-auto">
      {/* Header — Logo placeholder + title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 flex flex-col items-center text-center"
      >
        {/* Logo placeholder */}
        <div
          className="w-20 h-20 rounded-full border-2 flex items-center justify-center mb-5"
          style={{
            borderColor: 'rgba(212,175,55,0.4)',
            background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(11,11,11,0) 70%)',
            boxShadow: '0 0 24px rgba(212,175,55,0.12)',
          }}
        >
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-body text-center leading-tight px-2">
            Logo<br />Here
          </span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em] font-body mb-2" style={{ color: '#D4AF37' }}>
          Moxie Reserve
        </p>
        <h1 className="font-heading text-4xl text-foreground leading-tight">
          Your Collection
        </h1>
        <div className="h-px w-12 mt-3 mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
      </motion.div>

      {/* Stats Row */}
      <div className="flex gap-3 mb-8">
        <StatCard label="Total Bottles" value={bottles.length} delay={0.1} />
        <StatCard
          label="Total Value"
          value={`$${totalValue.toLocaleString()}`}
          delay={0.2}
        />
        <StatCard label="Open" value={openCount} sub="in rotation" delay={0.3} />
      </div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-body">Navigate</span>
        <div className="h-px flex-1 bg-border" />
      </motion.div>

      {/* The Ledger */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.5 }}
        className="mb-6 border border-border rounded-md overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="px-4 py-2 border-b border-border flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-body" style={{ color: '#D4AF37' }}>The Ledger</span>
        </div>
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="px-4 py-4 text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body mb-1">Total MSRP</p>
            <p className="font-heading text-xl text-foreground">${totalValue.toLocaleString()}</p>
          </div>
          <div className="px-4 py-4 text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body mb-1">Est. Market</p>
            <p
              className="font-heading text-xl"
              style={{
                color: '#D4AF37',
                textShadow: '0 0 14px rgba(212,175,55,0.5), 0 0 28px rgba(212,175,55,0.2)',
              }}
            >
              ${Math.round(totalValue * 1.35).toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <div className="space-y-3 mb-8">
        <QuickLink
          to="/library"
          icon={BookOpen}
          label="The Library"
          sub={`${bottles.length} bottle${bottles.length !== 1 ? 's' : ''} in your collection`}
          delay={0.4}
        />
        <QuickLink
          to="/alchemist"
          icon={FlaskConical}
          label="The Alchemist"
          sub={isPremium ? `${openCount} open bottles available to blend` : 'Core & Premier blends available free'}
          delay={0.5}
        />
        <QuickLink
          to="/vault"
          icon={Star}
          label="The Hunt"
          sub={`${wishlist.length} bottle${wishlist.length !== 1 ? 's' : ''} on the hunt`}
          delay={0.6}
        />
      </div>

      {/* Ambient note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-[11px] text-muted-foreground/50 font-body tracking-wider"
      >
        No ads · No tracking · Your cellar, your privacy.
      </motion.p>
    </div>
  );
}