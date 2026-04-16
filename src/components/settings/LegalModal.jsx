import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const PRIVACY_CONTENT = `At Moxie Reserve, your privacy is paramount. We collect only the data necessary to provide your private collection experience — bottle records, wishlist items, and blend creations. This data is stored securely and never sold or shared with third parties. We do not run ads, we do not track your behavior across other platforms, and we do not monetize your personal information. Your cellar is yours alone.`;

const TERMS_CONTENT = `By using Moxie Reserve, you agree to use the application solely for personal, non-commercial purposes. The "Premium for Life" upgrade grants a perpetual license to premium features for a single user account. All blend recipes, tasting notes, and collection data remain the intellectual property of the user who created them. Moxie Reserve is not responsible for any purchase decisions made based on market data displayed within the app. Market values are estimates and should not be treated as financial advice.`;

export default function LegalModal({ type, onClose }) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const content = isPrivacy ? PRIVACY_CONTENT : TERMS_CONTENT;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-lg bg-card border border-border rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{ maxHeight: '80vh' }}
      >
        <div className="px-5 py-4 border-b border-border flex items-center justify-between"
          style={{ background: 'rgba(212,175,55,0.03)' }}>
          <h2 className="font-heading text-lg text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-6" style={{ maxHeight: 'calc(80vh - 64px)' }}>
          <p className="font-body text-sm text-foreground/80 leading-relaxed">{content}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body mt-6">
            Last updated: April 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}