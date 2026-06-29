import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import ABCLogoSigle from '../../assets/ABCLogoSigle.png';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':    'Tableau de bord',
  '/stock':        'Stock & Produits',
  '/ventes':       'Ventes & Commandes',
  '/tracabilite':  'Traçabilité',
  '/utilisateurs': 'Gestion Utilisateurs',
};

export function AppLayout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? "J'adore";
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-brand-cream flex">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((c) => !c)}
      />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
            <p className="text-gray-400 text-xs">© SSD Consulting 2026</p>
            <img src={ABCLogoSigle} alt="ABC Agroalimentaire" className="h-7 w-auto object-contain opacity-70" />
          </div>
        </main>
      </div>
    </div>
  );
}
