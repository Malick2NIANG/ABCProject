import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ChevronDown, AlertCircle, CheckCircle, ArrowLeft, KeyRound, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { MOCK_USERS } from '../../utils/mockData';
import { ROLE_LABELS } from '../../utils/constants';
import ABCLogoSigle from '../../assets/ABCLogoSigle.png';

type View = 'login' | 'forgot-step1' | 'forgot-step2';
type Flash = { type: 'error' | 'success'; message: string } | null;

const MAX_ATTEMPTS = 3;

export function Login() {
  const { login } = useAuth();
  const { addPasswordResetRequest } = useApp();
  const navigate = useNavigate();

  // Login states
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [flash, setFlash]       = useState<Flash>(null);

  // Forgot password states
  const [view, setView]             = useState<View>('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [attempts, setAttempts]     = useState(MAX_ATTEMPTS);
  const [blocked, setBlocked]       = useState(false);

  function showFlash(type: 'error' | 'success', message: string) {
    setFlash({ type, message });
    setTimeout(() => setFlash(null), 4000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const ok = login(email, password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard');
    } else {
      showFlash('error', 'Email ou mot de passe incorrect. Vérifiez vos identifiants.');
    }
  }

  function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (blocked) return;

    const exists = MOCK_USERS.some((u) => u.email === forgotEmail && u.actif);

    if (!exists) {
      const remaining = attempts - 1;
      setAttempts(remaining);
      if (remaining <= 0) {
        setBlocked(true);
      }
      return;
    }

    addPasswordResetRequest(forgotEmail);
    setView('forgot-step2');
  }

  function resetToLogin() {
    setView('login');
    setForgotEmail('');
    setAttempts(MAX_ATTEMPTS);
    setBlocked(false);
    setFlash(null);
  }

  function quickLogin(userEmail: string) {
    const ok = login(userEmail, 'demo');
    if (ok) navigate('/dashboard');
  }

  const demoUsers = MOCK_USERS.filter((u) => u.actif);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center min-h-full py-10 px-2">

      {/* En-tête commun */}
      <div className="mb-7">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-3">
            <img src="/images/Logo.jpg" alt="J'adore" className="w-full h-full object-cover" />
          </div>
          <p className="text-xl font-bold text-brand-dark leading-none tracking-wide">J'adore</p>
          <p className="text-xs text-brand-gold font-semibold mt-1 tracking-widest uppercase">La qualité, naturellement.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── VUE : FORMULAIRE DE CONNEXION ── */}
        {view === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-sm text-gray-400 text-center mb-7">Connectez-vous pour accéder à votre espace.</p>

            {/* Flash */}
            <AnimatePresence>
              {flash && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-start gap-3 px-4 py-3 rounded-xl border mb-5 text-sm ${
                    flash.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
                  }`}
                >
                  {flash.type === 'error' ? <AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> : <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />}
                  <span>{flash.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-brand-dark">Adresse email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@jadore.sn" required
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-brand-dark">Mot de passe</label>
                  <button type="button" onClick={() => setView('forgot-step1')} className="text-xs text-brand-green hover:underline">
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green transition-all"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading}>Se connecter</Button>
            </form>

            {/* Accès démo */}
            <div className="mt-7 border-t border-gray-100 pt-5">
              <button
                onClick={() => setShowDemo(!showDemo)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-green transition-colors w-full justify-center"
              >
                Accès démo rapide
                <motion.span animate={{ rotate: showDemo ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={12} />
                </motion.span>
              </button>

              <AnimatePresence>
                {showDemo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }} className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-2">
                      {demoUsers.map((u) => (
                        <button
                          key={u.id} onClick={() => quickLogin(u.email)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-100 hover:border-brand-green/50 hover:bg-brand-cream transition-all text-left group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-brand-green/10 flex items-center justify-center">
                              <span className="text-brand-green text-xs font-bold">{u.prenom[0]}{u.nom[0]}</span>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-brand-dark">{u.prenom} {u.nom}</p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                          </div>
                          <span className="text-xs bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full font-medium">
                            {ROLE_LABELS[u.role].split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ── VUE : ÉTAPE 1 — VÉRIFICATION EMAIL ── */}
        {view === 'forgot-step1' && (
          <motion.div
            key="forgot-step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                <KeyRound size={18} className="text-brand-green" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-dark">Mot de passe oublié</p>
                <p className="text-xs text-gray-400">Saisissez votre email pour continuer</p>
              </div>
            </div>

            {/* Bloqué */}
            {blocked ? (
              <div className="flex items-start gap-3 px-4 py-4 rounded-xl bg-red-50 border border-red-200">
                <ShieldAlert size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700">Trop de tentatives</p>
                  <p className="text-xs text-red-500 mt-0.5">Réessayez plus tard ou contactez l'administrateur.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-brand-dark">Adresse email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="exemple@jadore.sn" required
                      className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green transition-all"
                    />
                  </div>
                </div>

                {/* Tentatives restantes */}
                {attempts < MAX_ATTEMPTS && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-orange-50 border border-orange-200"
                  >
                    <AlertCircle size={14} className="text-orange-500 flex-shrink-0" />
                    <p className="text-xs text-orange-700">
                      Email introuvable. {attempts} tentative{attempts > 1 ? 's' : ''} restante{attempts > 1 ? 's' : ''}.
                    </p>
                  </motion.div>
                )}

                <Button type="submit" className="w-full" size="lg">Vérifier l'email</Button>
              </form>
            )}

            <button onClick={resetToLogin} className="flex items-center gap-2 text-xs text-gray-400 hover:text-brand-green transition-colors mx-auto">
              <ArrowLeft size={13} />
              Retour à la connexion
            </button>
          </motion.div>
        )}

        {/* ── VUE : ÉTAPE 2 — CONFIRMATION ── */}
        {view === 'forgot-step2' && (
          <motion.div
            key="forgot-step2"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center">
                <CheckCircle size={28} className="text-brand-green" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-dark">Demande envoyée</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-xs">
                  Un nouveau mot de passe vous sera envoyé à l'adresse <span className="font-semibold text-brand-dark">{forgotEmail}</span> dès validation par l'administrateur.
                </p>
              </div>
            </div>

            <button onClick={resetToLogin} className="flex items-center gap-2 text-xs text-gray-400 hover:text-brand-green transition-colors mx-auto">
              <ArrowLeft size={13} />
              Retour à la connexion
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Footer */}
      <div className="flex items-center justify-between mt-8">
        <p className="text-gray-300 text-xs">© SSD Consulting 2026</p>
        <img src={ABCLogoSigle} alt="ABC Agroalimentaire" className="h-8 w-auto object-contain" />
      </div>
    </div>
  );
}
