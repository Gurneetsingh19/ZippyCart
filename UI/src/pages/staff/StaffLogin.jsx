import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, User, Lock, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffLogin = () => {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!staffId || !password) {
      showToast('Please enter Staff ID and Password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://zippycart-backend.onrender.com/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: staffId, password: password })
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        showToast('Login successful!');
        localStorage.setItem('staffToken', data.token);
        navigate('/staff/counter');
      } else {
        showToast(data.message || 'Login failed', 'error');
      }
    } catch (err) {
      showToast('Error connecting to server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 sm:bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-bl-full -z-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-100 rounded-tr-full -z-10 opacity-50"></div>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Store size={32} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 font-outfit">Staff Portal</h1>
          <p className="text-gray-500 mt-1">SmartCart Checkout System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID / Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="Enter your ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            Login to Counter
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
