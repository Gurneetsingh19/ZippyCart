import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, Keyboard, LogOut } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

export const CounterDashboard = () => {
  const navigate = useNavigate();
  const [manualId, setManualId] = useState('');
  const [scanError, setScanError] = useState(false);

  useEffect(() => {
    // Initialize Scanner if we want a real camera here.
    const scanner = new Html5QrcodeScanner('counter-reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    scanner.render(
      (decodedText) => {
        scanner.clear();
        navigate('/staff/verify', { state: { checkoutId: decodedText } });
      },
      (error) => {
        // scan errors ignored normally
      }
    );

    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner", error));
    };
  }, [navigate]);

  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!manualId) return;

    setIsLoading(true);
    setScanError(false);
    try {
      const response = await fetch(`https://zippycart-backend.onrender.com/api/staff/${manualId}/Bill`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        navigate('/staff/verify', { state: { session: data.cart } });
      } else {
        setScanError(data.message || 'Session not found');
      }
    } catch (err) {
      setScanError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('staffToken');
    navigate('/staff/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold font-outfit text-gray-900">Counter Dashboard</h1>
          <p className="text-sm text-green-600 font-medium flex items-center gap-1 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Online
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex flex-col items-center gap-1"
        >
          <LogOut size={20} />
          <span className="text-xs font-medium hidden sm:block">Logout</span>
        </button>
      </header>

      <div className="flex-1 p-6 max-w-lg mx-auto w-full flex flex-col gap-6 pt-12">
        
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col items-center text-center">
          <div className="bg-primary-50 p-4 rounded-full mb-4">
            <Scan size={32} className="text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold font-outfit mb-2">Scan Checkout QR</h2>
          <p className="text-gray-500 mb-6">Scan the customer's device to view their bill</p>
          
          <div id="counter-reader" className="w-full rounded-2xl overflow-hidden border-2 border-primary-100 bg-black min-h-[250px]"></div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Keyboard size={20} className="text-gray-500" />
            Manual Entry
          </h3>
          {scanError && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              {scanError}
            </div>
          )}
          <form onSubmit={handleVerify} className="flex gap-3">
            <input 
              type="text" 
              value={manualId}
              onChange={(e) => setManualId(e.target.value.toLowerCase())}
              placeholder="Session ID (e.g. SESS_...)"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none font-mono"
            />
            <button 
              type="submit"
              disabled={!manualId || isLoading}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              {isLoading ? '...' : 'Fetch Bill'}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};
