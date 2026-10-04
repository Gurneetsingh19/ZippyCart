import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ScanLine, Clock, ChevronRight, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';
import { Card } from '../../components/Card';
import { CustomerAuth } from './CustomerAuth';

export const Dashboard = () => {
  const { itemCount, subtotal, isLocked, sessionId, startSession } = useCart();
  const navigate = useNavigate();
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    const userData = localStorage.getItem('customerUser');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLoginSuccess = () => {
    const userData = localStorage.getItem('customerUser');
    setIsAuthenticated(true);
    setUser(JSON.parse(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return <CustomerAuth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header section with Purple Gradient */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 pt-12 pb-8 px-6 rounded-b-[2.5rem] shadow-lg">
        <div className="flex justify-between items-start mb-6 text-white">
          <div>
            <h1 className="text-2xl font-bold font-outfit">Hi, {user?.name || 'Welcome back'}!</h1>
            <p className="text-primary-100 mt-1 opacity-90">Store: SmartCart Supermarket</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleLogout}
              className="bg-white/10 p-2 rounded-xl backdrop-blur-md hover:bg-white/20 transition-colors"
              title="Logout"
            >
              <LogOut size={24} />
            </button>
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <ShoppingCart size={24} />
            </div>
          </div>
        </div>

        {/* Floating Cart Summary Card */}
        <Card className="mt-4 -mb-16 shadow-xl border-0 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Current Session</span>
              {isLocked ? (
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-md font-medium">Locked for Checkout</span>
              ) : (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active
                </span>
              )}
            </div>
            <div className="flex items-end justify-between mt-4">
              <div>
                <p className="text-3xl font-bold text-gray-900 font-outfit">{formatCurrency(subtotal)}</p>
                <p className="text-gray-500 text-sm mt-1">{itemCount} {itemCount === 1 ? 'item' : 'items'} in cart</p>
              </div>
              <button 
                onClick={() => navigate('/cart')}
                className="bg-primary-50 text-primary-700 p-3 rounded-xl hover:bg-primary-100 transition-colors flex items-center justify-center"
              >
                View Cart <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div className="px-6 mt-24">
        <h2 className="text-lg font-bold text-gray-900 mb-4 font-outfit">Quick Actions</h2>
        
        {/* Large Action Button CTA */}
        {!sessionId ? (
          <button
            onClick={async () => {
              setIsStartingSession(true);
              try {
                await startSession();
              } catch (e) {
                alert('Failed to start session: ' + e.message);
              } finally {
                setIsStartingSession(false);
              }
            }}
            disabled={isStartingSession}
            className="w-full bg-primary-600 text-white rounded-3xl p-6 shadow-md shadow-primary-500/30 flex flex-col items-center justify-center gap-4 hover:shadow-lg hover:bg-primary-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold font-outfit">{isStartingSession ? 'Starting...' : 'Start Shopping'}</h3>
              <p className="text-primary-100 text-sm mt-1">Click here to begin your session</p>
            </div>
          </button>
        ) : (
          <button
            onClick={() => navigate('/scan')}
            disabled={isLocked}
            className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 group"
          >
            <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <ScanLine size={40} className="text-primary-600" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 font-outfit">Scan Product</h3>
              <p className="text-gray-500 text-sm mt-1">Scan barcode to add items</p>
            </div>
          </button>
        )}
      </div>

      <div className="px-6 mt-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 font-outfit">Recent Activity</h2>
          <Clock size={16} className="text-gray-400" />
        </div>
        
        {itemCount === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">Your cart is empty. Start scanning!</p>
          </div>
        ) : (
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-50">
            <p className="text-gray-600 mb-4">You have {itemCount} items ready.</p>
            {!isLocked && (
              <button
                onClick={() => navigate('/checkout/prepare')}
                className="w-full bg-primary-600 text-white font-medium py-3 rounded-xl hover:bg-primary-700 shadow-md shadow-primary-500/20 transition-colors"
              >
                Proceed to Checkout
              </button>
            )}
            {isLocked && (
              <button
                onClick={() => navigate('/checkout/qr')}
                className="w-full bg-orange-500 text-white font-medium py-3 rounded-xl hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-colors"
              >
                View Checkout QR
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
