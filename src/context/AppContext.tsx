import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product, Order, User, AuditLog, MouvementStock, PasswordResetRequest } from '../types';
import {
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_USERS,
  MOCK_AUDIT_LOGS,
  MOCK_MOUVEMENTS,
} from '../utils/mockData';

interface AppContextValue {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'date'>) => void;
  mouvements: MouvementStock[];
  addMouvement: (m: Omit<MouvementStock, 'id' | 'date'>) => void;
  lowStockProducts: Product[];
  passwordResetRequests: PasswordResetRequest[];
  addPasswordResetRequest: (email: string) => void;
  validatePasswordReset: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts]     = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders]         = useState<Order[]>(MOCK_ORDERS);
  const [users, setUsers]           = useState<User[]>(MOCK_USERS);
  const [auditLogs, setAuditLogs]   = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [mouvements, setMouvements]                     = useState<MouvementStock[]>(MOCK_MOUVEMENTS);
  const [passwordResetRequests, setPasswordResetRequests] = useState<PasswordResetRequest[]>([]);

  const lowStockProducts = products.filter((p) => p.quantite <= p.seuilAlerte);

  function addPasswordResetRequest(email: string) {
    setPasswordResetRequests((prev) => [
      { id: `prr-${Date.now()}`, email, date: new Date().toISOString(), status: 'en_attente' },
      ...prev,
    ]);
  }

  function validatePasswordReset(id: string) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const tempPassword = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setPasswordResetRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: 'validee', tempPassword } : r)
    );
    console.log(`[SIM EMAIL] Mot de passe temporaire envoyé : ${tempPassword}`);
  }

  function addAuditLog(log: Omit<AuditLog, 'id' | 'date'>) {
    setAuditLogs((prev) => [
      { ...log, id: `a${Date.now()}`, date: new Date().toISOString() },
      ...prev,
    ]);
  }

  function addMouvement(m: Omit<MouvementStock, 'id' | 'date'>) {
    setMouvements((prev) => [
      { ...m, id: `m${Date.now()}`, date: new Date().toISOString() },
      ...prev,
    ]);
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== m.produitId) return p;
        const delta = m.type === 'sortie' ? -m.quantite : m.quantite;
        return { ...p, quantite: Math.max(0, p.quantite + delta) };
      })
    );
  }

  return (
    <AppContext.Provider
      value={{ products, setProducts, orders, setOrders, users, setUsers, auditLogs, addAuditLog, mouvements, addMouvement, lowStockProducts, passwordResetRequests, addPasswordResetRequest, validatePasswordReset }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
