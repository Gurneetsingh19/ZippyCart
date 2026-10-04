import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Lock, Receipt, ChevronRight } from 'lucide-react';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';

export const CheckoutPrepare = () => {
  const { itemCount, subtotal, processCheckout } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      await processCheckout();
      navigate('/checkout/qr');
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title="Checkout Summary" />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-primary-50 rounded-2xl p-6 mb-6 flex flex-col items-center text-center border border-primary-100">
          <Receipt size={48} className="text-primary-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 font-outfit mb-1">
            {formatCurrency(subtotal)}
          </h2>
          <p className="text-gray-600">Total for {itemCount} items</p>
        </div>

        <Card className="mb-6 shadow-sm border-0">
          <div className="flex items-start gap-4 p-2">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600 flex-shrink-0 mt-1">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Ready to pay?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Generating the checkout QR will lock your cart. You won't be able to add or remove items until the checkout is complete or cancelled at the counter.
              </p>
            </div>
          </div>
        </Card>

        <ul className="space-y-4 px-2">
          <li className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
            Generate the QR code below
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
            Walk to the Self-Checkout or Staff Counter
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
            Show the QR code to complete payment
          </li>
        </ul>
      </div>

      <div className="p-6 bg-white border-t border-gray-100">
        <button 
          onClick={handleGenerateQR}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-4 rounded-xl font-medium shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-transform text-lg disabled:opacity-50"
        >
          <Lock size={20} />
          {loading ? 'Processing...' : 'Generate Checkout QR'}
        </button>
      </div>
    </div>
  );
};
