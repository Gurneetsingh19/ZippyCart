import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

export const BottomSheet = ({ isOpen, onClose, children, title }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0 pointer-events-none">
      {/* Backdrop */}
      <div 
        className={clsx(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        className={clsx(
          "relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl transition-transform duration-300 pointer-events-auto",
          isOpen ? "translate-y-0 scale-100" : "translate-y-full sm:translate-y-8 sm:scale-95"
        )}
      >
        <div className="p-4 flex flex-col max-h-[90vh]">
          {/* Handle */}
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="overflow-y-auto overflow-x-hidden -mx-4 px-4 pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
