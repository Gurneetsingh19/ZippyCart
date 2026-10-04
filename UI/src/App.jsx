import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Company Route
import { Welcome } from './pages/company/Welcome';

// Customer Routes
import { Dashboard } from './pages/customer/Dashboard';
import { Scanner } from './pages/customer/Scanner';
import { Cart } from './pages/customer/Cart';
import { CheckoutPrepare } from './pages/customer/CheckoutPrepare';
import { CheckoutQR } from './pages/customer/CheckoutQR';
import { CheckoutSuccess } from './pages/customer/CheckoutSuccess';

// Staff Pages
import { StaffLogin } from './pages/staff/StaffLogin';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { CounterDashboard } from './pages/staff/CounterDashboard';
import { StaffVerify } from './pages/staff/StaffVerify';
import { StaffPayment } from './pages/staff/StaffPayment';
import { StaffComplete } from './pages/staff/StaffComplete';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 flex justify-center">
            {/* Mobile container for customer, wider for staff if needed, handled in components */}
            <div className="w-full max-w-md sm:max-w-full min-h-screen bg-gray-50 shadow-2xl relative overflow-hidden">
              <Routes>
                {/* Welcome / Landing Route */}
                <Route path="/" element={<Welcome />} />

                {/* Customer Routes */}
                <Route path="/customer" element={<Dashboard />} />
                <Route path="/scan" element={<Scanner />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout/prepare" element={<CheckoutPrepare />} />
                <Route path="/checkout/qr" element={<CheckoutQR />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />

                {/* Staff Routes */}
                <Route path="/staff/login" element={<StaffLogin />} />
                <Route path="/staff/dashboard" element={<StaffDashboard />} />
                <Route path="/staff/counter" element={<CounterDashboard />} />
                <Route path="/staff/verify" element={<StaffVerify />} />
                <Route path="/staff/payment" element={<StaffPayment />} />
                <Route path="/staff/complete" element={<StaffComplete />} />
              </Routes>
            </div>
          </div>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
