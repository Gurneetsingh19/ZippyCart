import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ShoppingCart, Building2, Mail, Phone, MapPin, Lock, ArrowRight, Zap, ShieldCheck, BarChart3, X, CheckCircle2, Download, PackagePlus, UserPlus, Scan } from 'lucide-react';
import QRCode from 'react-qr-code';

export const Welcome = () => {
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredData, setRegisteredData] = useState(null);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // In a real app, call your company login API here.
    navigate('/staff/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://zippycart-backend.onrender.com/api/register_store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          workEmail: formData.email,
          phoneNumber: formData.phone,
          storeAddress: formData.address,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      console.log('Company registered successfully:', data);
      
      const customerLink = `${window.location.origin}/customer?store=${data.company_id}`;
      setRegisteredData({ companyId: data.company_id, link: customerLink });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Features data
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Lightning Fast Checkout",
      description: "Say goodbye to long queues. Our smartcart technology allows customers to scan and pay in seconds."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
      title: "Bank-Grade Security",
      description: "Fast and secure transactions with end-to-end encryption to protect both you and your customers."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      title: "Real-time Analytics",
      description: "Track inventory, monitor sales, and get intelligent insights into customer buying patterns instantly."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-slate-900 overflow-x-hidden font-sans relative text-white">

      {/* Abstract Background Shapes */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob pointer-events-none"></div>
      <div className="fixed top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">ZippyCart</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">Who We Are</a>
            <button onClick={() => setIsLoginModalOpen(true)} className="hover:text-white transition-colors">Login</button>
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-5 py-2.5 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Register Company
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 flex flex-col items-center text-center z-10 max-w-5xl mx-auto min-h-screen justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          The Future of Retail is Here
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-tight"
        >
          Welcome to <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            <TypeAnimation
              sequence={[
                'ZippyCart.',
                3000,
                'Smart Checkout.',
                3000,
                'Seamless Retail.',
                3000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-2xl text-slate-300 font-light max-w-3xl mb-12 leading-relaxed"
        >
          ZippyCart is a fast and secure smartcart application designed to revolutionize the way your customers shop. Empower your store today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group transition-all"
          >
            Register Your Company
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#features"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center"
          >
            Explore Features
          </a>
        </motion.div>
      </section>

      {/* Features / Who We Are Section */}
      <section id="features" className="relative py-24 px-6 bg-slate-900/50 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Who We Are</h2>
            <p className="text-xl text-slate-400 font-light">
              We are a team of innovators dedicated to eliminating the friction of traditional retail.
              ZippyCart transforms ordinary shopping trips into seamless, magical experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Flow Section */}
      <section id="how-it-works" className="relative py-24 px-6 bg-slate-950 border-t border-white/5 z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How to setup ZippyCart</h2>
            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
              Create your smart store in minutes. Just follow these simple steps to revolutionize your customer's shopping experience.
            </p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-transparent hidden md:block"></div>

            {[
              {
                title: "Register Your Company",
                desc: "Create an account and get your unique Store QR Code instantly. Paste it at your storefront.",
                icon: <Building2 className="w-8 h-8 text-blue-400" />
              },
              {
                title: "Insert Your Products",
                desc: "Log into the Admin Dashboard and easily add your store's inventory and pricing into the database.",
                icon: <PackagePlus className="w-8 h-8 text-purple-400" />
              },
              {
                title: "Create Staff IDs",
                desc: "From the Admin Dashboard, generate secure login credentials for your cashiers and floor staff.",
                icon: <UserPlus className="w-8 h-8 text-indigo-400" />
              },
              {
                title: "Customers Start Scanning",
                desc: "Customers scan your QR code at the entrance to access the web app and scan products via their phones!",
                icon: <Scan className="w-8 h-8 text-green-400" />
              },
              {
                title: "Staff Manage Checkouts",
                desc: "Your staff logs into the Staff Page to verify checkouts and process payments instantly.",
                icon: <CheckCircle2 className="w-8 h-8 text-yellow-400" />
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className={`relative flex items-center justify-between mb-16 md:mb-24 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}
              >
                {/* Content */}
                <div className="w-full md:w-[45%] bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-all shadow-xl group">
                  <div className="text-5xl font-black text-white/5 absolute -top-4 right-2 group-hover:text-white/10 transition-colors pointer-events-none">
                    0{index + 1}
                  </div>
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5 relative z-10">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 relative z-10">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed relative z-10">{step.desc}</p>
                </div>
                
                {/* Center Node */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-slate-900 border-4 border-blue-500 rounded-full items-center justify-center z-20 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>

                {/* Empty Space for alignment */}
                <div className="hidden md:block w-[45%]"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 text-center text-slate-500 z-10 relative bg-slate-950">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ShoppingCart className="w-5 h-5" />
          <span className="font-bold text-white tracking-tight">ZippyCart</span>
        </div>
        <p>© 2026 ZippyCart Technologies. All rights reserved.</p>
      </footer>

      {/* Registration Modal */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Join ZippyCart</h2>
                <p className="text-slate-400">Register your company to get started</p>
              </div>

              {error && !registeredData && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                  {error}
                </div>
              )}

              {registeredData ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center p-4"
                >
                  <div className="bg-green-500/20 p-4 rounded-full mb-4">
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Registration Successful!</h3>
                  <p className="text-slate-300 mb-6 font-medium">Paste it on your store front gate and also some where.</p>
                  
                  <div className="bg-white p-4 rounded-2xl mb-8 inline-block shadow-lg" id="store-qr-code-container">
                    <QRCode value={registeredData.link} size={200} />
                  </div>
                  
                  <div className="flex gap-4 w-full">
                      <button 
                        onClick={() => {
                          const svg = document.getElementById("store-qr-code-container").querySelector("svg");
                          const svgData = new XMLSerializer().serializeToString(svg);
                          const canvas = document.createElement("canvas");
                          const ctx = canvas.getContext("2d");
                          const img = new Image();
                          img.onload = () => {
                            canvas.width = img.width + 40; // add padding
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
                        className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Download size={18} />
                        Download QR
                      </button>
                      <button 
                        onClick={() => {
                          setIsRegisterModalOpen(false);
                          setRegisteredData(null);
                          navigate('/staff/dashboard');
                        }}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
                      >
                        DONE
                        <ArrowRight size={18} />
                      </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required placeholder="Acme Supermarket" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="hello@acme.com" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 pb-4">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Store Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="123 Market St, City" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                    {!loading && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl"
            >
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-slate-400">Login to your company dashboard</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" name="email" value={loginData.email} onChange={handleLoginChange} required placeholder="hello@acme.com" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500" />
                  </div>
                </div>

                <div className="space-y-1 pb-4">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} required placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Login to Dashboard
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
