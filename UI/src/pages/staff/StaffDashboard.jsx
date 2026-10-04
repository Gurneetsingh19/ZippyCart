import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, UserCheck, UserMinus, UserPlus, PackagePlus, QrCode, Download } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useToast } from '../../context/ToastContext';

export const StaffDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Create Staff State
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffRole, setStaffRole] = useState('cashier');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!staffName || !staffEmail || !staffPassword) {
      showToast('Please fill all fields', 'error');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('http://localhost:5000/api/staff/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: staffName, 
          email: staffEmail, 
          password: staffPassword,
          role: staffRole 
        })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        showToast('Staff registered successfully!');
        setStaffName('');
        setStaffEmail('');
        setStaffPassword('');
      } else {
        showToast(data.message || 'Failed to register staff', 'error');
      }
    } catch (err) {
      showToast('Error connecting to server', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateInventory = (e) => {
    e.preventDefault();
    alert('Inventory update API will be connected here.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Staff Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold font-outfit text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-green-600 font-medium flex items-center gap-1 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Online
          </p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex flex-col items-center gap-1"
        >
          <LogOut size={20} />
          <span className="text-xs font-medium hidden sm:block">Logout</span>
        </button>
      </header>

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Admin Forms */}
        <div className="space-y-6">
          
          {/* Create Staff Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus size={20} className="text-primary-600" />
              Create New Staff
            </h3>
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <input 
                type="text" 
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="email" 
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="Email or ID"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <select 
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none text-gray-600"
                >
                  <option value="cashier">Cashier</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <input 
                type="password" 
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <button 
                type="submit"
                disabled={isCreating}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isCreating ? 'Creating...' : 'Create Staff Account'}
              </button>
            </form>
          </div>

          {/* Manage Inventory Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PackagePlus size={20} className="text-primary-600" />
              Manage Inventory
            </h3>
            <form onSubmit={handleUpdateInventory} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Barcode"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none font-mono"
                />
                <input 
                  type="text" 
                  placeholder="Item Name"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="Price (₹)"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none text-gray-600">
                  <option value="">Select Category</option>
                  <option value="groceries">Groceries</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="dairy">Dairy</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors active:scale-[0.98]"
              >
                Add / Update Item
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Employee Status and QR */}
        <div className="space-y-6">

          {/* Store QR Code Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 w-full justify-center">
              <QrCode size={20} className="text-primary-600" />
              Store QR Code
            </h3>
            <p className="text-sm text-gray-500 mb-6">Customers scan this to start shopping</p>
            
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mb-6 inline-block" id="admin-store-qr">
              <QRCode value={`${window.location.origin}/customer?store=dummystore`} size={160} />
            </div>
            
            <button 
              onClick={() => {
                const svg = document.getElementById("admin-store-qr").querySelector("svg");
                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();
                img.onload = () => {
                  canvas.width = img.width + 40;
                  canvas.height = img.height + 40;
                  ctx.fillStyle = "white";
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  ctx.drawImage(img, 20, 20);
                  const pngFile = canvas.toDataURL("image/png");
                  const downloadLink = document.createElement("a");
                  downloadLink.download = "zippycart-store-qr.png";
                  downloadLink.href = pngFile;
                  downloadLink.click();
                };
                img.src = "data:image/svg+xml;base64," + btoa(svgData);
              }}
              className="flex items-center gap-2 text-sm text-primary-600 font-bold hover:text-primary-700 transition-colors bg-primary-50 hover:bg-primary-100 px-6 py-2.5 rounded-xl"
            >
              <Download size={18} />
              Download QR PNG
            </button>
          </div>

          {/* Employee Status Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users size={20} className="text-primary-600" />
              Employee Status
            </h3>
            <span className="text-xs font-bold bg-primary-50 text-primary-700 px-2 py-1 rounded-md">Live</span>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Priya Sharma (Counter 1)', status: 'online', img: 'https://i.pravatar.cc/150?img=5' },
              { name: 'Rahul Kumar (Counter 2)', status: 'online', img: 'https://i.pravatar.cc/150?img=11' },
              { name: 'Ananya Patel (Counter 3)', status: 'online', img: 'https://i.pravatar.cc/150?img=20' }, // current
              { name: 'Riya Desai (Manager)', status: 'offline', img: 'https://i.pravatar.cc/150?img=9' },
              { name: 'Aryan Singh (Floor)', status: 'offline', img: 'https://i.pravatar.cc/150?img=8' }
            ].map((emp, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:bg-gray-100 cursor-default">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={emp.img} 
                      alt={emp.name} 
                      className={`w-10 h-10 rounded-full object-cover border-2 ${emp.status === 'online' ? 'border-green-500' : 'border-gray-300'}`} 
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{emp.name}</p>
                    <p className={`text-xs capitalize font-medium ${emp.status === 'online' ? 'text-green-600' : 'text-gray-500'}`}>
                      {emp.status}
                    </p>
                  </div>
                </div>
                <div className="flex h-3 w-3 relative">
                  {emp.status === 'online' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${emp.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>

      </div>
    </div>
  );
};
