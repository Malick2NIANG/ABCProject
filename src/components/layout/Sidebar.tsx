import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  Users,
  LogOut,
  X,
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
}

export function Sidebar({ open, onClose }: Props) {
  const { currentUser, logout } = useAuth();
  const { lowStockProducts } = useApp();

  const visibleItems = NAV_ITEMS.filter((item) =>
    currentUser ? (item.roles as readonly string[]).includes(currentUser.role) : false
  );

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen w-60 bg-brand-dark flex flex-col z-30 shadow-xl
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      {/* Logo + bouton fermeture mobile */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-white/20">
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
        <div className="leading-tight flex-1">
          <p className="text-white font-bold text-sm">J'adore</p>
          <p className="text-white/50 text-xs">ABC Agroalimentaire</p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative ${
                isActive
                  ? 'bg-brand-green text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
            {item.to === '/stock' && lowStockProducts.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {lowStockProducts.length}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {currentUser?.prenom[0]}{currentUser?.nom[0]}
            </span>
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-white text-xs font-semibold truncate">
              {currentUser?.prenom} {currentUser?.nom}
            </p>
            <p className="text-white/40 text-xs capitalize">{currentUser?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-white/50 hover:bg-red-600/20 hover:text-red-400 text-sm transition-colors"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
