import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';

export const Cart = () => {
  const { items, updateQuantity, removeItem, subtotal, isLocked } = useCart();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title="Your Cart" />
      
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-primary-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-outfit mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't scanned any products yet.</p>
            <button 
              onClick={() => navigate('/scan')}
              className="bg-primary-600 text-white px-8 py-3 rounded-full font-medium shadow-md shadow-primary-500/20 hover:bg-primary-700 transition-colors"
            >
              Start Scanning
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.product.id} className="flex gap-4 p-3 border-none shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover mix-blend-multiply p-1"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{item.product.unit}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-primary-700">
                      {formatCurrency(item.product.price)}
                    </span>
                    
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                      <button 
                        disabled={isLocked || item.quantity <= 1}
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button 
                        disabled={isLocked}
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <button 
                  disabled={isLocked}
                  onClick={() => removeItem(item.product.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Bar */}
      {items.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-6 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-20">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-gray-500">Total Amount</span>
            <span className="text-2xl font-bold font-outfit text-gray-900">{formatCurrency(subtotal)}</span>
          </div>
          
          {isLocked ? (
            <button 
              onClick={() => navigate('/checkout/qr')}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-medium shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-transform text-lg"
            >
              View Checkout QR
            </button>
          ) : (
            <button 
              onClick={() => navigate('/checkout/prepare')}
              className="w-full bg-primary-600 text-white py-4 rounded-xl font-medium shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-transform text-lg"
            >
              Checkout Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};
