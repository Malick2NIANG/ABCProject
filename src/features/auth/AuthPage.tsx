import { Login } from './Login';
import { AuthLogin } from './AuthLogin';

export function AuthPage() {
  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* Colonne gauche — Formulaire */}
      <div className="h-full overflow-y-auto flex items-center justify-center bg-white px-6">
        <Login />
      </div>

      {/* Colonne droite — Visuel carrousel (masqué sur mobile) */}
      <div className="hidden lg:block relative">
        <AuthLogin />
      </div>
    </div>
  );
}
