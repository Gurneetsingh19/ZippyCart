import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, X, ShieldAlert } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import { formatCurrency } from '../../utils/currency';

export const StaffVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkoutSession } = useCart();
  
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    // Session is passed from CounterDashboard
    if (location.state?.session) {
      setSession(location.state.session);
    } else {
      // Mock data if accessed directly without passing session
      setSession({
        session_id: 'CHK-DEMO1',
        total: 185.00,
        items: [
          { product: products[0], quantity: 2 },
          { product: products[1], quantity: 5 }
        ],
        createdAt: new Date().toISOString()
      });
    }
  }, [location]);

  if (!session) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white px-6 py-4 border-b border-gray-200 flex items-center shadow-sm">
        <button 
          onClick={() => navigate('/staff/dashboard')}
          className="p-2 -ml-2 mr-4 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold font-outfit text-gray-900">Verify Cart</h1>
        <div className="ml-auto bg-gray-100 px-3 py-1 rounded-md font-mono text-sm font-medium">
          {session.session_id || session.id}
        </div>
      </header>

      <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
        
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <ShieldAlert className="text-orange-500 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-orange-900">Spot Check Recommended</h3>
            <p className="text-sm text-orange-700 mt-1">Please verify that the customer has roughly {session.items.length} items in their basket.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Cart Contents</h3>
            <span className="bg-white px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
              {session.items.reduce((acc, item) => acc + item.quantity, 0)} Items
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {session.items.map((item, idx) => (
              <div key={idx} className="p-4 flex gap-4 items-center">
                <img 
                  src={item.product?.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80"} 
                  alt={item.name || item.product?.name || 'Product'} 
                  className="w-16 h-16 object-cover rounded-lg bg-gray-50 border border-gray-100 mix-blend-multiply p-1"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name || item.product?.name}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatCurrency(item.price || item.product?.price)}</p>
                </div>
                <div className="font-bold text-gray-900 text-lg">
                  {formatCurrency((item.price || item.product?.price) * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-gray-500 font-medium">Total Amount</span>
            <span className="text-3xl font-bold font-outfit text-primary-700">{formatCurrency(session.total)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/staff/dashboard')}
            className="py-4 border border-red-200 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <X size={20} />
            Reject Cart
          </button>
          <button 
            onClick={() => navigate('/staff/payment', { state: { session } })}
            className="py-4 bg-primary-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Proceed to Payment
          </button>
        </div>

      </div>
    </div>
  );
};
