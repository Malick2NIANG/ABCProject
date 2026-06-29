import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Menu, User, KeyRound,
  LogOut, X, Eye, EyeOff, CheckCircle, AlertCircle, ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../utils/constants';
import { CommandPalette } from '../shared/CommandPalette';

interface Props {
  title: string;
  onMenuClick: () => void;
}

type Modal = 'profile' | 'password' | null;
type Toast = { type: 'success' | 'error'; message: string } | null;

export function Topbar({ title, onMenuClick }: Props) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modal, setModal]               = useState<Modal>(null);
  const [toast, setToast]               = useState<Toast>(null);
  const [cmdOpen, setCmdOpen]           = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Password form
  const [oldPwd, setOldPwd]           = useState('');
  const [newPwd, setNewPwd]           = useState('');
  const [confirmPwd, setConfirmPwd]   = useState('');
  const [showOld, setShowOld]         = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    function handleCtrlK(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
    }
    window.addEventListener('keydown', handleCtrlK);
    return () => window.removeEventListener('keydown', handleCtrlK);
  }, []);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function openModal(m: Modal) {
    setDropdownOpen(false);
    setOldPwd(''); setNewPwd(''); setConfirmPwd('');
    setShowOld(false); setShowNew(false); setShowConfirm(false);
    setModal(m);
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!oldPwd) {
      showToast('error', 'Saisissez votre ancien mot de passe.');
      return;
    }
    if (newPwd.length < 6) {
      showToast('error', 'Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (newPwd !== confirmPwd) {
      showToast('error', 'La confirmation ne correspond pas au nouveau mot de passe.');
      return;
    }
    setModal(null);
    showToast('success', 'Mot de passe mis à jour avec succès.');
  }

  const profileRows = [
    { label: 'Email',         value: currentUser?.email ?? '—' },
    { label: 'Rôle',          value: currentUser ? ROLE_LABELS[currentUser.role] : '—' },
    { label: 'Contact',       value: currentUser?.telephone ?? '—' },
    { label: 'Statut',        value: currentUser?.actif ? 'Actif' : 'Inactif' },
    { label: 'Membre depuis', value: currentUser?.dateCreation ? new Date(currentUser.dateCreation).toLocaleDateString('fr-FR') : '—' },
  ];

  const pwdFields: Array<{
    label: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
  }> = [
    { label: 'Ancien mot de passe',       value: oldPwd,     setValue: setOldPwd,     show: showOld,     setShow: setShowOld },
    { label: 'Nouveau mot de passe',      value: newPwd,     setValue: setNewPwd,     show: showNew,     setShow: setShowNew },
    { label: 'Confirmer le mot de passe', value: confirmPwd, setValue: setConfirmPwd, show: showConfirm, setShow: setShowConfirm },
  ];

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:px-6 sticky top-0 z-20 shadow-sm">

        {/* Gauche : hamburger + titre */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-brand-cream transition-colors text-brand-dark flex-shrink-0"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base font-semibold text-brand-dark truncate">{title}</h1>
        </div>

        {/* Centre : trigger palette */}
        <div className="hidden md:flex justify-center flex-shrink-0">
          <button
            onClick={() => setCmdOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-brand-cream hover:border-brand-green/40 transition-colors w-56 text-left"
          >
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <span className="flex-1 text-sm text-gray-400">Aller à...</span>
            <kbd className="text-xs bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-400 font-sans leading-none flex-shrink-0">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Droite : profil */}
        <div className="flex-1 flex justify-end">
        <div ref={dropdownRef} className="relative pl-2 border-l border-gray-100">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-brand-cream transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {currentUser?.prenom[0]}{currentUser?.nom[0]}
              </span>
            </div>
            <div className="hidden md:block leading-tight text-left">
              <p className="text-xs font-semibold text-brand-dark">
                {currentUser?.prenom} {currentUser?.nom}
              </p>
              <p className="text-xs text-gray-400">
                {currentUser ? ROLE_LABELS[currentUser.role] : ''}
              </p>
            </div>
            <ChevronDown
              size={13}
              className={`hidden md:block text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-xs font-semibold text-brand-dark truncate">
                    {currentUser?.prenom} {currentUser?.nom}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{currentUser?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => openModal('profile')}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-brand-dark hover:bg-brand-cream transition-colors"
                  >
                    <User size={15} className="text-gray-400" />
                    Mon profil
                  </button>
                  <button
                    onClick={() => openModal('password')}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-brand-dark hover:bg-brand-cream transition-colors"
                  >
                    <KeyRound size={15} className="text-gray-400" />
                    Changer mon mot de passe
                  </button>
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </header>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className={`fixed top-4 right-4 z-[70] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {toast.type === 'success'
              ? <CheckCircle size={16} className="flex-shrink-0" />
              : <AlertCircle size={16} className="flex-shrink-0" />
            }
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Mon profil ── */}
              {modal === 'profile' && (
                <>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-brand-dark text-sm">Mon profil</h2>
                    <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="px-6 py-6 space-y-5">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-brand-green flex items-center justify-center shadow-sm">
                        <span className="text-white text-2xl font-bold">
                          {currentUser?.prenom[0]}{currentUser?.nom[0]}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-brand-dark">{currentUser?.prenom} {currentUser?.nom}</p>
                        <p className="text-xs text-brand-green font-semibold mt-0.5">
                          {currentUser ? ROLE_LABELS[currentUser.role] : ''}
                        </p>
                      </div>
                    </div>
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                      {profileRows.map((row) => (
                        <div key={row.label} className="flex justify-between items-center px-4 py-3 border-b last:border-b-0 border-gray-50">
                          <span className="text-xs text-gray-400">{row.label}</span>
                          <span className="text-xs font-medium text-brand-dark text-right max-w-[60%] truncate">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── Changer mot de passe ── */}
              {modal === 'password' && (
                <>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-brand-dark text-sm">Changer mon mot de passe</h2>
                    <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <form onSubmit={handlePasswordSubmit} className="px-6 py-5 space-y-4">
                    {pwdFields.map((field) => (
                      <div key={field.label} className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-brand-dark">{field.label}</label>
                        <div className="relative">
                          <input
                            type={field.show ? 'text' : 'password'}
                            value={field.value}
                            onChange={(e) => field.setValue(e.target.value)}
                            required
                            className="w-full pl-3 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => field.setShow(!field.show)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {field.show ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="submit"
                      className="w-full bg-brand-green text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-green/90 transition-colors mt-1"
                    >
                      Mettre à jour
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
