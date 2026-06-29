import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AlertBanner } from '../../components/shared/AlertBanner';
import { ConfirmModal } from '../../components/shared/ConfirmModal';
import { UserTable } from './components/UserTable';
import { UserModal } from './components/UserModal';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../../components/shared/Pagination';
import type { User } from '../../types';

export function UsersPage() {
  const { users, setUsers, addAuditLog } = useApp();
  const { currentUser } = useAuth();

  const [userModal, setUserModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [resetTarget, setResetTarget] = useState<User | null>(null);
  const [resetSuccess, setResetSuccess] = useState('');

  function handleSave(data: Omit<User, 'id' | 'dateCreation'>) {
    if (userModal.user) {
      setUsers((prev) => prev.map((u) => u.id === userModal.user!.id ? { ...u, ...data } : u));
      addAuditLog({ action: 'modification_utilisateur', utilisateurId: currentUser!.id, utilisateurNom: `${currentUser!.prenom} ${currentUser!.nom}`, detail: `Utilisateur modifié : ${data.prenom} ${data.nom}` });
    } else {
      const newUser: User = { ...data, id: `u${Date.now()}`, dateCreation: new Date().toISOString() };
      setUsers((prev) => [...prev, newUser]);
      addAuditLog({ action: 'creation_utilisateur', utilisateurId: currentUser!.id, utilisateurNom: `${currentUser!.prenom} ${currentUser!.nom}`, detail: `Compte créé : ${data.prenom} ${data.nom} (${data.role})` });
    }
    setUserModal({ open: false, user: null });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function handleResetPassword() {
    if (!resetTarget) return;
    setResetSuccess(`Mot de passe réinitialisé pour ${resetTarget.prenom} ${resetTarget.nom}. Un email a été envoyé à ${resetTarget.email}.`);
    setResetTarget(null);
    setTimeout(() => setResetSuccess(''), 5000);
  }

  const activeCount = users.filter((u) => u.actif).length;
  const { page, setPage, pageSize, setPageSize, paginated, total, totalPages } = usePagination(users);

  return (
    <div className="space-y-5">
      {resetSuccess && <AlertBanner type="success" message={resetSuccess} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-brand-dark">{users.length} utilisateur(s)</h2>
          <p className="text-sm text-gray-400">{activeCount} actif(s)</p>
        </div>
        <Button onClick={() => setUserModal({ open: true, user: null })}>
          <Plus size={16} /> Nouvel utilisateur
        </Button>
      </div>

      <Card padding={false}>
        <UserTable
          users={paginated}
          onEdit={(u) => setUserModal({ open: true, user: u })}
          onDelete={(u) => setDeleteTarget(u)}
          onResetPassword={(u) => setResetTarget(u)}
        />
        <div className="border-t border-gray-100">
          <Pagination page={page} totalPages={totalPages} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </Card>

      <UserModal
        open={userModal.open}
        user={userModal.user}
        onSave={handleSave}
        onClose={() => setUserModal({ open: false, user: null })}
      />
      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer l'utilisateur"
        message={`Voulez-vous supprimer le compte de ${deleteTarget?.prenom} ${deleteTarget?.nom} ?`}
        confirmLabel="Supprimer"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmModal
        open={!!resetTarget}
        title="Réinitialiser le mot de passe"
        message={`Un nouveau mot de passe sera envoyé à ${resetTarget?.email}.`}
        confirmLabel="Réinitialiser"
        onConfirm={handleResetPassword}
        onCancel={() => setResetTarget(null)}
      />
    </div>
  );
}
