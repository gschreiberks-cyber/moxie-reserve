import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FlaskConical, Settings } from 'lucide-react';

// Custom Glencairn-behind-bars SVG icon for The Hunt
function GlencairnIcon({ size = 20, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glencairn glass body */}
      <path
        d="M7 3 C7 3 5.5 7 5.5 10 C5.5 12.5 7 14 10 14 C13 14 14.5 12.5 14.5 10 C14.5 7 13 3 13 3 Z"
        stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} fill="none" strokeLinejoin="round"
      />
      {/* Stem */}
      <line x1="10" y1="14" x2="10" y2="17" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} strokeLinecap="round" />
      {/* Base */}
      <line x1="7.5" y1="17" x2="12.5" y2="17" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} strokeLinecap="round" />
      {/* Bars overlaid */}
      <line x1="6" y1="2" x2="6" y2="16" stroke="currentColor" strokeWidth={active ? 1.5 : 1.2} strokeLinecap="round" opacity="0.7" />
      <line x1="10" y1="2" x2="10" y2="5" stroke="currentColor" strokeWidth={active ? 1.5 : 1.2} strokeLinecap="round" opacity="0.7" />
      <line x1="14" y1="2" x2="14" y2="16" stroke="currentColor" strokeWidth={active ? 1.5 : 1.2} strokeLinecap="round" opacity="0.7" />
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