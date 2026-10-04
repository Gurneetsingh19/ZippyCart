import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Home, Receipt } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';

export const CheckoutSuccess = () => {
  const { checkoutSession, clearCart } = useCart();
  const navigate = useNavigate();

  // We keep checkoutSession to display receipt, but we must clear it if user leaves
  useEffect(() => {
    if (!checkoutSession) {
      navigate('/');
    }
  }, [checkoutSession, navigate]);

  const handleDone = () => {
    clearCart();
    navigate('/');
  };

  if (!checkoutSession) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-6 flex flex-col items-center pt-16">
        
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 font-outfit mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8 text-center">Your transaction was completed successfully.</p>
        
        {/* Digital Receipt Card */}
        <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative mb-8">
          {/* Receipt ZigZag Bottom (Simulated via CSS masking or pseudo elements) */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-dashed border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="text-2xl font-bold text-gray-900 font-outfit">{formatCurrency(checkoutSession.total)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Payment Mode</p>
                <p className="font-semibold text-gray-900">UPI / Card</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-medium text-gray-900">TXN{Math.random().toString().slice(2, 10)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Checkout ID</span>
                <span className="font-medium text-gray-900">{checkoutSession.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date & Time</span>
                <span className="font-medium text-gray-900">
                  {new Date(checkoutSession.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <button className="w-full py-3 bg-gray-50 text-primary-700 font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
              <Download size={18} />
              Download Full Receipt
            </button>
          </div>
          
          <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-50 rounded-full border-r border-gray-100"></div>
          <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-50 rounded-full border-l border-gray-100"></div>
        </div>

      </div>
      
      <div className="p-6 bg-white border-t border-gray-100">
        <button 
          onClick={handleDone}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-4 rounded-xl font-medium shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-colors text-lg"
        >
          <Home size={20} />
          Start New Shopping Session
        </button>
      </div>
    </div>
  );
};
