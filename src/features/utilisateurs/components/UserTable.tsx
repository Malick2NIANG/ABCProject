import { Pencil, Trash2, RotateCcw } from 'lucide-react';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import type { User } from '../../../types';
import { ROLE_LABELS, ROLE_COLORS } from '../../../utils/constants';
import { formatDate } from '../../../utils/formatters';

interface Props {
  users: User[];
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
  onResetPassword: (u: User) => void;
}

export function UserTable({ users, onEdit, onDelete, onResetPassword }: Props) {
  const columns = [
    {
      key: 'nom',
      header: 'Utilisateur',
      render: (u: User) => (
        <div>
          <p className="font-medium text-brand-dark">{u.prenom} {u.nom}</p>
          <p className="text-xs text-gray-400">{u.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      render: (u: User) => (
        <Badge className={ROLE_COLORS[u.role]}>{ROLE_LABELS[u.role]}</Badge>
      ),
    },
    {
      key: 'statut',
      header: 'Statut',
      render: (u: User) => (
        <Badge className={u.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
          {u.actif ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      key: 'connexion',
      header: 'Dernière connexion',
      render: (u: User) => (
        <span className="text-sm text-gray-400">
          {u.derniereConnexion ? formatDate(u.derniereConnexion) : '—'}
        </span>
      ),
    },
    {
      key: 'created',
      header: 'Créé le',
      render: (u: User) => <span className="text-sm text-gray-400">{formatDate(u.dateCreation)}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (u: User) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onResetPassword(u); }} title="Réinitialiser mot de passe">
            <RotateCcw size={14} />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(u); }} title="Modifier">
            <Pencil size={14} />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(u); }} title="Supprimer" className="hover:text-red-600">
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={users} emptyMessage="Aucun utilisateur trouvé" />;
}
