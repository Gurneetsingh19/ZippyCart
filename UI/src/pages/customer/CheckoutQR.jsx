import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';

export const CheckoutQR = () => {
  const { checkoutSession, clearCart } = useCart();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (!checkoutSession) {
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // In a real app, we might invalidate the QR
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [checkoutSession, navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!checkoutSession) return null;

  return (
    <div className="flex flex-col min-h-screen bg-primary-600">
      {/* Header (No back button logic to allow editing, cart is locked) */}
      <div className="flex items-center p-4 text-white">
        <button onClick={() => navigate('/')} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <span className="ml-2 font-medium">Dashboard</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative flex flex-col items-center text-center">
          
          <div className="bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest mb-6">
            {checkoutSession.id}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 font-outfit mb-2">
            {formatCurrency(checkoutSession.total)}
          </h2>
          <p className="text-gray-500 mb-8">{checkoutSession.items.length} items</p>

          {/* Real QR Code using checkoutSession.id */}
          <div className="w-56 h-56 bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-center mb-6 relative overflow-hidden">
            {/* Corner marks typical of QR */}
            <div className="absolute top-2 left-2 w-8 h-8 border-4 border-gray-900 rounded-tl-lg pointer-events-none"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-4 border-gray-900 rounded-tr-lg pointer-events-none"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-4 border-gray-900 rounded-bl-lg pointer-events-none"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-4 border-gray-900 rounded-br-lg pointer-events-none"></div>
            
            <div className="w-full h-full flex items-center justify-center bg-white z-10 p-2">
              <QRCode 
                value={checkoutSession.id} 
                size={180}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            
            {/* Fake scanning line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary-500/50 shadow-[0_0_10px_theme(colors.primary.500)] animate-scan mix-blend-multiply rounded-full z-20 pointer-events-none"></div>
          </div>

          <p className="font-medium text-gray-900 mb-2">Show this QR at the counter</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>Code expires in:</span>
            <span className={`font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-primary-600'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

        </div>

        <div className="mt-8 flex items-center gap-2 text-primary-100 bg-primary-700/50 px-4 py-2 rounded-full">
          <ShieldCheck size={18} />
          <span className="text-sm font-medium">Secured by SmartCart</span>
        </div>
      </div>
      
      {/* Dev helper to simulate staff completion */}
      <button 
        onClick={() => {
          navigate('/checkout/success');
        }}
        className="absolute bottom-4 right-4 text-xs bg-white/20 text-white px-3 py-1 rounded-full opacity-50 hover:opacity-100"
      >
        Simulate Pay
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};
