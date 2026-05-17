import { Login } from './Login';
import { AuthLogin } from './AuthLogin';

export function AuthPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Colonne gauche — Formulaire */}
      <div className="flex items-center justify-center bg-white px-6">
        <Login />
      </div>

      {/* Colonne droite — Visuel carrousel (masqué sur mobile) */}
      <div className="hidden lg:block relative">
        <AuthLogin />
      </div>
    </div>
  );
}
