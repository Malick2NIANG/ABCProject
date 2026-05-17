import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, ClipboardList, Users, X, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

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

export function CommandPalette({ open, onClose }: Props) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleItems = NAV_ITEMS.filter((item) =>
    currentUser ? (item.roles as readonly string[]).includes(currentUser.role) : false
  );

  const filtered = query.trim()
    ? visibleItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : visibleItems;

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function handle(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === 'Enter' && filtered[selected]) {
        navigate(filtered[selected].to);
        onClose();
      }
    }
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [open, filtered, selected, navigate, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
              <Command size={16} className="text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Aller à..."
                className="flex-1 text-sm text-brand-dark placeholder:text-gray-400 outline-none bg-transparent"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Liste */}
            <div className="py-2 max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Aucun résultat</p>
              ) : (
                filtered.map((item, idx) => {
                  const isActive = pathname === item.to;
                  const isSelected = selected === idx;
                  return (
                    <button
                      key={item.to}
                      onClick={() => { navigate(item.to); onClose(); }}
                      onMouseEnter={() => setSelected(idx)}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${
                        isSelected ? 'bg-brand-cream' : ''
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive ? 'bg-brand-green' : 'bg-brand-green/10'
                      }`}>
                        <item.icon size={18} className={isActive ? 'text-white' : 'text-brand-green'} />
                      </div>
                      <span className={`text-sm font-semibold ${isActive ? 'text-brand-green' : 'text-brand-dark'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer raccourcis */}
            <div className="px-4 py-2.5 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
              <span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-sans">↑ ↓</kbd> naviguer</span>
              <span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-sans">Entrée</kbd> aller</span>
              <span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-sans">Échap</kbd> fermer</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
