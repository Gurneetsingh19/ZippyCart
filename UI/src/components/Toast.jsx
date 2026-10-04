import { CheckCircle2, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export const Toast = ({ message, type = 'success' }) => {
  return (
    <div className={clsx(
      "flex items-center gap-3 p-4 rounded-xl shadow-lg backdrop-blur-md border animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto",
      type === 'success' ? "bg-green-50/90 border-green-200 text-green-800" : "bg-red-50/90 border-red-200 text-red-800"
    )}>
      {type === 'success' ? <CheckCircle2 className="text-green-600" /> : <AlertCircle className="text-red-600" />}
      <p className="font-medium text-sm">{message}</p>
    </div>
  );
};
