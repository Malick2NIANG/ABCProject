import { type ReactNode } from 'react';
import { PackageSearch } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({
  title = 'Aucun résultat',
  description = 'Il n\'y a rien à afficher pour le moment.',
  action,
  icon,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center mb-4">
        {icon ?? <PackageSearch size={28} className="text-brand-green opacity-60" />}
      </div>
      <h3 className="font-semibold text-brand-dark mb-1">{title}</h3>
      <p className="text-sm text-gray-400 max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}
