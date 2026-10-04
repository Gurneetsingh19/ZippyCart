import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Home, Printer } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useEffect } from 'react';

export const StaffComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart, checkoutSession } = useCart();
  
  const session = location.state?.session;
  
  // If the customer session matches, clear the customer cart so they can start fresh
  useEffect(() => {
    if (session && checkoutSession && session.id === checkoutSession.id) {
       clearCart();
    }
  }, [session, checkoutSession, clearCart]);

  if (!session) {
    navigate('/staff/counter');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      
      <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-xl border border-gray-100 text-center relative overflow-hidden">
        
        {/* Background confeti / decor */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-50 rounded-full blur-3xl -z-10"></div>

        <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
          <CheckCircle2 size={48} />
        </div>

        <h1 className="text-3xl font-bold font-outfit text-gray-900 mb-2">Checkout Complete</h1>
        <p className="text-gray-500 mb-8">Transaction successfully processed and verified.</p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
          <div className="flex justify-between mb-3 text-sm">
            <span className="text-gray-500">Checkout ID</span>
            <span className="font-mono font-medium">{session.session_id || session.id}</span>
          </div>
          <div className="flex justify-between mb-3 text-sm">
            <span className="text-gray-500">Amount Paid</span>
            <span className="font-medium text-gray-900">{formatCurrency(session.total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-medium text-gray-900 uppercase">{location.state?.method || 'Card'}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            className="w-full py-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Printer size={20} />
            Print Receipt
          </button>
          <button 
            onClick={() => navigate('/staff/counter')}
            className="w-full py-4 bg-primary-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Next Customer
          </button>
        </div>
        
      </div>
      
    </div>
  );
};
