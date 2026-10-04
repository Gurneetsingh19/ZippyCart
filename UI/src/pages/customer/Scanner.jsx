import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flashlight, X, Keyboard, ScanLine } from 'lucide-react';
import { Header } from '../../components/Header';
import { BottomSheet } from '../../components/BottomSheet';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/currency';

export const Scanner = () => {
  const navigate = useNavigate();
  const { isLocked, sessionId, storeId, setItems } = useCart();
  const { showToast } = useToast();
  
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  
  const [scannedProduct, setScannedProduct] = useState(null);
  const [showProductSheet, setShowProductSheet] = useState(false);

  useEffect(() => {
    if (isLocked) {
      showToast('Checkout in progress. Cannot scan more items.', 'error');
      navigate('/');
      return;
    }

    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 150 } },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        handleProductScanned(decodedText);
      },
      (error) => {}
    );

    return () => {
      scanner.clear().catch(e => console.log("Failed to clear scanner", e));
    };
  }, [isScanning, isLocked, navigate, showToast]);

  const handleProductScanned = async (barcode) => {
    setIsScanning(false);
    try {
      const response = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode, company_id: storeId })
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setScannedProduct({ ...data.product, barcode });
        setShowProductSheet(true);
      } else {
        showToast(data.message || 'Product not found.', 'error');
        setIsScanning(true);
      }
    } catch (err) {
      showToast('Error finding product.', 'error');
      setIsScanning(true);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualBarcode.trim()) return;
    setShowManualEntry(false);
    handleProductScanned(manualBarcode.trim());
  };

  const confirmAddProduct = async () => {
    if (scannedProduct && sessionId) {
      try {
        const token = localStorage.getItem('customerToken');
        const response = await fetch(`http://localhost:5000/api/${sessionId}/add`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ barcode: scannedProduct.barcode, company_id: storeId })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          // Update items from server response
          setItems(data.cart.items.map(item => ({ product: { id: item.product_id, name: item.name, price: item.price, barcode: item.barcode }, quantity: item.quantity })));
          showToast(`${scannedProduct.name} added to cart`);
        } else {
          showToast(data.message || 'Failed to add item', 'error');
        }
      } catch (err) {
        showToast('Error adding product', 'error');
      } finally {
        setShowProductSheet(false);
        setScannedProduct(null);
        setTimeout(() => setIsScanning(true), 500);
      }
    }
  };

  const cancelAddProduct = () => {
    setShowProductSheet(false);
    setScannedProduct(null);
    setTimeout(() => setIsScanning(true), 500);
  };

  return (
    <div className="flex flex-col h-screen bg-black relative">
      {/* Scanner Overlay UI */}
      <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
        <Header 
          title="Scan Barcode" 
          showBack={true} 
          className="bg-transparent border-none text-white backdrop-blur-none" 
          rightElement={
            <button 
              onClick={() => setIsFlashlightOn(!isFlashlightOn)}
              className={`p-2 rounded-full pointer-events-auto transition-colors ${isFlashlightOn ? 'bg-yellow-400 text-black' : 'bg-black/50 text-white'}`}
            >
              <Flashlight size={24} />
            </button>
          }
        />

        {/* Scanner Target Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <p className="text-white mb-8 text-center bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
            Point camera at product barcode
          </p>
          
          <div className="relative w-72 h-48 border-2 border-white/30 rounded-2xl overflow-hidden">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-2xl"></div>
            
            {/* Scanning Line Animation */}
            {isScanning && (
              <div className="absolute top-0 left-0 w-full h-0.5 bg-primary-400 shadow-[0_0_15px_rgba(167,139,250,0.8)] animate-scan z-20"></div>
            )}
            
            {/* Camera feed */}
            <div id="reader" className="absolute inset-0 bg-gray-900/40 w-[150%] h-[150%] origin-top-left scale-[0.66]"></div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pb-12 pt-6 px-6 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center pointer-events-auto">
          <button 
            onClick={() => setShowManualEntry(true)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-full transition-colors"
          >
            <Keyboard size={20} />
            <span>Enter Barcode Manually</span>
          </button>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showManualEntry && (
        <div className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold font-outfit">Manual Entry</h3>
              <button onClick={() => setShowManualEntry(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleManualSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Barcode Number</label>
                <input 
                  type="text" 
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  className="w-full border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 border outline-none"
                  placeholder="e.g. 8901058863646"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 mb-6">Try: 8901234567890 (Amul Milk)</p>
              <button 
                type="submit"
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
              >
                Find Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Scanned Bottom Sheet */}
      <BottomSheet 
        isOpen={showProductSheet} 
        onClose={cancelAddProduct}
        title="Product Found"
      >
        {scannedProduct && (
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 bg-gray-100 rounded-2xl mb-4 overflow-hidden shadow-inner">
              <img 
                src={scannedProduct.image} 
                alt={scannedProduct.name} 
                className="w-full h-full object-cover mix-blend-multiply p-2"
              />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 font-outfit mb-1">
              {scannedProduct.name}
            </h3>
            <p className="text-gray-500 text-sm mb-4">{scannedProduct.unit}</p>
            
            <div className="text-3xl font-bold text-primary-700 mb-8">
              {formatCurrency(scannedProduct.price)}
            </div>
            
            <div className="w-full flex gap-3">
              <button 
                onClick={cancelAddProduct}
                className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAddProduct}
                className="flex-1 py-3.5 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 shadow-md shadow-green-500/30 transition-colors flex justify-center items-center gap-2"
              >
                <ScanLine size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
      
      {/* Required style for scanning line animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}} />
    </div>
  );
};
