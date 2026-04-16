import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen font-body" style={{
      background: 'radial-gradient(ellipse 80% 40% at 50% 0%, #1c1c1c 0%, #0B0B0B 55%)',
    }}>
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}