import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  Users,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Tableau de bord',    icon: LayoutDashboard, roles: ['admin', 'stock', 'vendeur'] },
  { to: '/stock',        label: 'Stock & Produits',   icon: Package,         roles: ['admin', 'stock'] },
  { to: '/ventes',       label: 'Ventes & Commandes', icon: ShoppingCart,    roles: ['admin', 'stock', 'vendeur'] },
  { to: '/tracabilite',  label: 'Traçabilité',        icon: ClipboardList,   roles: ['admin'] },
  { to: '/utilisateurs', label: 'Utilisateurs',       icon: Users,           roles: ['admin'] },
] as const;

interface Props {
  open: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ open, onClose, isCollapsed, onToggleCollapse }: Props) {
  const { currentUser, logout } = useAuth();
  const { lowStockProducts } = useApp();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const visibleItems = NAV_ITEMS.filter((item) =>
    currentUser ? (item.roles as readonly string[]).includes(currentUser.role) : false
  );

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-brand-dark flex flex-col z-30 shadow-xl
        transition-all duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${isCollapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Header : logo + fermeture mobile */}
      <div className={`flex items-center border-b border-white/10 h-16 flex-shrink-0 ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-5'}`}>
        <div className={`rounded-xl overflow-hidden flex-shrink-0 border border-white/20 transition-all duration-300 ${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'}`}>
          <img
            src="/images/Logo.jpg"
            alt="J'adore"
            className="w-full h-full object-cover"
            onError={(e) => {
              const el = e.currentTarget;
              el.style.display = 'none';
              const parent = el.parentElement!;
              parent.classList.add('bg-brand-green', 'flex', 'items-center', 'justify-center');
              parent.innerHTML = '<span class="text-white font-bold text-sm">J</span>';
            }}
          />
        </div>

        {!isCollapsed && (
          <div className="leading-tight flex-1 overflow-hidden">
            <p className="text-white font-bold text-sm truncate">J'adore</p>
            <p className="text-white/50 text-xs truncate">ABC Agroalimentaire</p>
          </div>
        )}

        {/* Bouton fermeture mobile */}
        {!isCollapsed && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Bouton collapse — cercle flottant sur le bord droit, desktop uniquement */}
      <button
        onClick={onToggleCollapse}
        className="hidden lg:flex absolute -right-3 top-[6.25rem] -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center text-gray-500 shadow-md hover:bg-brand-cream hover:text-brand-dark transition-colors z-40"
        title={isCollapsed ? 'Développer le menu' : 'Réduire le menu'}
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {visibleItems.map((item, idx) => (
          <div
            key={item.to}
            className="relative"
            onMouseEnter={() => isCollapsed && setHoveredItem(item.to)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg text-sm font-medium transition-colors relative
                ${isCollapsed ? 'justify-center px-0 py-2.5 w-full' : 'px-3 py-2.5'}
                ${isActive
                  ? 'bg-brand-green text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && item.to === '/stock' && lowStockProducts.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold flex-shrink-0">
                  {lowStockProducts.length}
                </span>
              )}
            </NavLink>

            {/* Badge stock en mode collapsed */}
            {isCollapsed && item.to === '/stock' && lowStockProducts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold z-10">
                {lowStockProducts.length}
              </span>
            )}

            {/* Tooltip (collapsed uniquement) — fixed pour échapper au clip du overflow-y-auto */}
            {isCollapsed && hoveredItem === item.to && (
              <div
                className="fixed left-[4.5rem] z-50 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-xl font-medium whitespace-nowrap pointer-events-none shadow-lg -translate-y-1/2"
                style={{ top: `${99 + idx * 40}px` }}
              >
                {item.label}
              </div>
            )}
          </div>
        ))}

      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-2 flex-shrink-0">
        <button
          onClick={logout}
          className={`flex items-center gap-2 w-full rounded-lg text-white/50 hover:bg-red-600/20 hover:text-red-400 text-sm transition-colors
            ${isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'}
          `}
          title={isCollapsed ? 'Déconnexion' : undefined}
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
