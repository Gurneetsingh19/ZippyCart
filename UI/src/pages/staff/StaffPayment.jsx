import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, Smartphone, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';

export const StaffPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  // Call clearCart so we can finish the session if it's linked
  const { clearCart, checkoutSession } = useCart();
  
  const session = location.state?.session;
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!session) {
    navigate('/staff/dashboard');
    return null;
  }

  const [countdown, setCountdown] = useState(0);

  const handlePayment = async () => {
    setIsProcessing(true);
    setCountdown(5);

    // 5-second countdown timer
    for (let i = 4; i >= 0; i--) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(i);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/staff/${session.session_id || session.id}/payment_completed`, {
        method: 'POST'
      });
      const data = await response.json();

      if (response.ok && data.success) {
        showToast('Payment successful!');
        if (checkoutSession && checkoutSession.id === (session.session_id || session.id)) {
          clearCart(); // Clear the cart on this device if it was a local checkout
        }
        navigate('/staff/complete', { state: { session, method: selectedMethod, receipt: data.receipt } });
      } else {
        showToast(data.message || 'Payment processing failed', 'error');
        setIsProcessing(false);
      }
    } catch (err) {
      showToast('Error connecting to payment server', 'error');
      setIsProcessing(false);
    }
  };

  const methods = [
    { id: 'upi', name: 'UPI / QR Code', icon: Smartphone, desc: 'Scan store QR' },
    { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, desc: 'Swipe or Tap' },
    { id: 'cash', name: 'Cash', icon: Banknote, desc: 'Exact change preferred' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white px-6 py-4 border-b border-gray-200 flex items-center shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 mr-4 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={isProcessing}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold font-outfit text-gray-900">Payment Process</h1>
      </header>

      <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
        
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center mb-8">
          <p className="text-gray-500 font-medium mb-2">Amount Due</p>
          <h2 className="text-5xl font-bold font-outfit text-gray-900 mb-2">
            {formatCurrency(session.total)}
          </h2>
          <p className="text-sm text-gray-400 font-mono">Checkout ID: {session.session_id || session.id}</p>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-4 font-outfit">Select Payment Method</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {methods.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMethod === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                disabled={isProcessing}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col h-full ${
                  isSelected 
                    ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-500/10' 
                    : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className={`p-3 rounded-full w-max mb-4 ${isSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <Icon size={24} />
                </div>
                <h4 className={`font-bold ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>{m.name}</h4>
                <p className={`text-sm mt-1 ${isSelected ? 'text-primary-700' : 'text-gray-500'}`}>{m.desc}</p>
              </button>
            );
          })}
        </div>

        <button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-4 bg-primary-600 text-white text-lg font-medium rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              Processing Payment ({countdown}s)...
            </>
          ) : (
            `Confirm & Pay ${formatCurrency(session.total)}`
          )}
        </button>

      </div>
    </div>
  );
};
