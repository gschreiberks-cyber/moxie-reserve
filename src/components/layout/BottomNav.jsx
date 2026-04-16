import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FlaskConical, Settings } from 'lucide-react';

// Glencairn glass with bold jail bars
function GlencairnIcon({ size = 20, active }) {
  const stroke = active ? '#D4AF37' : 'currentColor';
  const sw = active ? 2 : 1.5;
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glencairn glass body */}
      <path
        d="M7 3 C7 3 5.5 7 5.5 10 C5.5 12.5 7 14 10 14 C13 14 14.5 12.5 14.5 10 C14.5 7 13 3 13 3 Z"
        stroke={stroke} strokeWidth={sw} fill="none" strokeLinejoin="round"
      />
      {/* Stem */}
      <line x1="10" y1="14" x2="10" y2="17" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      {/* Base */}
      <line x1="7" y1="17" x2="13" y2="17" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      {/* JAIL BARS — bold, full-height vertical lines over the glass */}
      <line x1="5"  y1="1" x2="5"  y2="18" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" />
      <line x1="10" y1="1" x2="10" y2="18" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" />
      <line x1="15" y1="1" x2="15" y2="18" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" />
      {/* Horizontal cross-bar */}
      <line x1="4.5" y1="5" x2="15.5" y2="5" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

const navItems = [
  { path: '/',          label: 'Home',      icon: LayoutDashboard },
  { path: '/library',   label: 'Library',   icon: BookOpen },
  { path: '/alchemist', label: 'Alchemist', icon: FlaskConical },
  { path: '/vault',     label: 'The Hunt',  icon: null, customIcon: GlencairnIcon },
  { path: '/settings',  label: 'Settings',  icon: Settings },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border backdrop-blur-md"
      style={{ background: 'rgba(11,11,11,0.92)' }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {navItems.map(({ path, label, icon: Icon, customIcon: CustomIcon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 px-2 py-1.5 transition-all duration-200 ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              style={isActive ? { filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' } : {}}
            >
              {CustomIcon
                ? <CustomIcon size={20} active={isActive} />
                : <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
              }
              <span className="text-[9px] font-body tracking-wider uppercase">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}