import { Store, Truck } from 'lucide-react';
import type { OrderChannel } from '../../../types';

interface Props {
  selected: OrderChannel | null;
  onSelect: (channel: OrderChannel) => void;
}

const CHANNELS: { value: OrderChannel; label: string; desc: string; icon: typeof Store }[] = [
  { value: 'physique', label: 'Vente Physique', desc: 'Terminal caisse en boutique', icon: Store },
  { value: 'distance', label: 'Commande à Distance', desc: 'Téléphone, livraison, grossiste', icon: Truck },
];

export function ChannelSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
      {CHANNELS.map((c) => (
        <button
          key={c.value}
          onClick={() => onSelect(c.value)}
          className={`flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all ${
            selected === c.value
              ? 'border-brand-green bg-brand-green/5 shadow-md'
              : 'border-gray-200 hover:border-brand-green/40 hover:bg-brand-cream'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selected === c.value ? 'bg-brand-green' : 'bg-brand-cream'}`}>
            <c.icon size={22} className={selected === c.value ? 'text-white' : 'text-brand-green'} />
          </div>
          <div>
            <p className="font-semibold text-brand-dark">{c.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
