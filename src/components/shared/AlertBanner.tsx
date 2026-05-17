import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';
import { useState } from 'react';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface Props {
  type?: AlertType;
  message: string;
  dismissible?: boolean;
}

const CONFIG: Record<AlertType, { bg: string; text: string; icon: typeof Info }> = {
  info:    { bg: 'bg-blue-50 border-blue-200',   text: 'text-blue-800',  icon: Info },
  success: { bg: 'bg-green-50 border-green-200', text: 'text-green-800', icon: CheckCircle },
  warning: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', icon: AlertTriangle },
  error:   { bg: 'bg-red-50 border-red-200',     text: 'text-red-800',   icon: XCircle },
};

export function AlertBanner({ type = 'info', message, dismissible = true }: Props) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const { bg, text, icon: Icon } = CONFIG[type];

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${bg} ${text}`}>
      <Icon size={16} className="flex-shrink-0" />
      <span className="text-sm flex-1">{message}</span>
      {dismissible && (
        <button onClick={() => setVisible(false)} className="opacity-60 hover:opacity-100">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
