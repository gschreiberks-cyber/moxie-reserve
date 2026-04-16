import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FlaskConical, Star, Settings } from 'lucide-react';

const navItems = [
  { path: '/',          label: 'Home',      icon: LayoutDashboard },
  { path: '/library',   label: 'Library',   icon: BookOpen },
  { path: '/alchemist', label: 'Alchemist', icon: FlaskConical },
  { path: '/vault',     label: 'Vault',     icon: Star },
  { path: '/settings',  label: 'Settings',  icon: Settings },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border backdrop-blur-md"
      style={{ background: 'rgba(11,11,11,0.92)' }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {navItems.map(({ path, label, icon: Icon }) => {
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
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[9px] font-body tracking-wider uppercase">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}