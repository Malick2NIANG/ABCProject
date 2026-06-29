import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { User, Role } from '../../../types';
import { ROLE_LABELS } from '../../../utils/constants';

interface Props {
  open: boolean;
  user: User | null;
  onSave: (data: Omit<User, 'id' | 'dateCreation'>) => void;
  onClose: () => void;
}

const EMPTY: Omit<User, 'id' | 'dateCreation'> = {
  nom: '',
  prenom: '',
  email: '',
  role: 'vendeur',
  actif: true,
};

export function UserModal({ open, user, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<User, 'id' | 'dateCreation'>>(EMPTY);

  useEffect(() => {
    setForm(user ? { nom: user.nom, prenom: user.prenom, email: user.email, role: user.role, actif: user.actif } : EMPTY);
  }, [user, open]);

  if (!open) return null;

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-brand-dark">
            {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); onSave(form); }}
          className="px-6 py-5 space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prénom" value={form.prenom} onChange={(e) => set('prenom', e.target.value)} required />
            <Input label="Nom" value={form.nom} onChange={(e) => set('nom', e.target.value)} required />
          </div>

          <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-brand-dark">Rôle</label>
            <select
              value={form.role}
              onChange={(e) => set('role', e.target.value as Role)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40"
            >
              {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-brand-dark">Compte actif</label>
            <button
              type="button"
              onClick={() => set('actif', !form.actif)}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.actif ? 'bg-brand-green' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.actif ? 'left-5.5 translate-x-1' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit">{user ? 'Enregistrer' : 'Créer le compte'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
