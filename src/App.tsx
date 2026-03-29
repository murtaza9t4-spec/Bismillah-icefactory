import React from 'react';
import { Receipt, Settings as SettingsType } from './types';
import ReceiptForm from './components/ReceiptForm';
import ReceiptHistory from './components/ReceiptHistory';
import Settings from './components/Settings';
import DealersBook from './components/DealersBook';
import PrintableReceipt from './components/PrintableReceipt';
import { LayoutDashboard, History, Settings as SettingsIcon, PlusCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DEFAULT_SETTINGS: SettingsType = {
  golaPrice: 100,
  nextReceiptNo: 607,
  totalStock: 420
};

export default function App() {
  const [activeTab, setActiveTab] = React.useState<'form' | 'history' | 'settings' | 'dealers'>('form');
  const [receipts, setReceipts] = React.useState<Receipt[]>([]);
  const [settings, setSettings] = React.useState<SettingsType>(DEFAULT_SETTINGS);
  const [printingReceipt, setPrintingReceipt] = React.useState<Receipt | null>(null);
  const [isPrinting, setIsPrinting] = React.useState(false);

  // Calculate Gola Summary
  const selledGolas = receipts.reduce((sum, r) => sum + (r.golaQty || 0), 0);
  const availableGolas = settings.totalStock - selledGolas;

  // Load data from localStorage
  React.useEffect(() => {
    const savedReceipts = localStorage.getItem('ice_factory_receipts');
    const savedSettings = localStorage.getItem('ice_factory_settings');
    
    if (savedReceipts) setReceipts(JSON.parse(savedReceipts));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  // Save data to localStorage
  const saveReceipts = (newReceipts: Receipt[]) => {
    setReceipts(newReceipts);
    localStorage.setItem('ice_factory_receipts', JSON.stringify(newReceipts));
  };

  const saveSettings = (newSettings: SettingsType) => {
    setSettings(newSettings);
    localStorage.setItem('ice_factory_settings', JSON.stringify(newSettings));
    setActiveTab('form');
  };

  const handleSaveReceipt = (receipt: Receipt) => {
    const newReceipts = [receipt, ...receipts];
    saveReceipts(newReceipts);
    
    // Update next receipt number
    const newSettings = { ...settings, nextReceiptNo: receipt.receiptNo + 1 };
    saveSettings(newSettings);
    
    setActiveTab('history');
  };

  const handleSaveAndPrint = (receipt: Receipt) => {
    handleSaveReceipt(receipt);
    handlePrint(receipt);
  };

  const handleDeleteReceipt = (id: string) => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      const newReceipts = receipts.filter(r => r.id !== id);
      saveReceipts(newReceipts);
    }
  };

  const handleUpdateStatus = (id: string, status: 'Paid' | 'Pending') => {
    const newReceipts = receipts.map(r => r.id === id ? { ...r, paymentStatus: status } : r);
    saveReceipts(newReceipts);
  };

  const handleDownloadImage = async (receipt: Receipt) => {
    setIsPrinting(true);
    setPrintingReceipt(receipt);
    
    setTimeout(async () => {
      const element = document.getElementById('printable-receipt');
      if (element) {
        try {
          const canvas = await html2canvas(element, {
            scale: 3,
            useCORS: true,
            backgroundColor: '#ffffff'
          });
          
          const link = document.createElement('a');
          link.download = `Receipt_${receipt.receiptNo}_${receipt.customerName}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        } catch (error) {
          console.error('Download failed:', error);
        }
      }
      setPrintingReceipt(null);
      setIsPrinting(false);
    }, 800);
  };

  const handlePrint = async (receipt: Receipt) => {
    setIsPrinting(true);
    setPrintingReceipt(receipt);
    
    // Wait for the component to render and fonts to load
    setTimeout(async () => {
      const element = document.getElementById('printable-receipt');
      if (element) {
        try {
          // Direct Browser Print (Most reliable for physical printers and fonts)
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
              .map(style => style.outerHTML)
              .join('');

            printWindow.document.write(`
              <html>
                <head>
                  <title>Receipt #${receipt.receiptNo} - Bismillah Ice Factory</title>
                  ${styles}
                  <style>
                    @media print {
                      @page { margin: 0; }
                      body { margin: 0; padding: 10mm; }
                      #printable-receipt { 
                        border: 8px solid #dc2626 !important; 
                        box-shadow: none !important; 
                        width: 100% !important; 
                        max-width: none !important;
                        margin: 0 !important;
                        padding: 20px !important;
                      }
                      .no-print { display: none !important; }
                    }
                    body { background: white; font-family: sans-serif; }
                  </style>
                </head>
                <body>
                  <div id="print-container">
                    ${element.outerHTML}
                  </div>
                  <script>
                    window.onload = () => {
                      setTimeout(() => {
                        window.print();
                        window.close();
                      }, 500);
                    };
                  </script>
                </body>
              </html>
            `);
            printWindow.document.close();
          } else {
            // Fallback to PDF if popup is blocked
            const canvas = await html2canvas(element, {
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Receipt_${receipt.receiptNo}.pdf`);
          }
        } catch (error) {
          console.error('Printing failed:', error);
        }
      }
      setPrintingReceipt(null);
      setIsPrinting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20 md:pb-0">
      {/* Printing Overlay */}
      {isPrinting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Generating Receipt...</h3>
            <p className="text-gray-500 font-bold">Please wait while we prepare your professional receipt for printing.</p>
            <p className="text-red-600 font-sindhi mt-4 text-xl">رسيد تيار ٿي رهي آهي...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-inner">
              <span className="text-2xl">❄️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Bismillah Ice Factory</h1>
              <p className="text-xs font-medium text-red-100 font-sindhi">بسم اللّه آئيس فيڪٽري رستم</p>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${activeTab === 'form' ? 'bg-white text-red-700 shadow-md' : 'hover:bg-red-600'}`}
            >
              <PlusCircle size={18} /> New Receipt
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${activeTab === 'history' ? 'bg-white text-red-700 shadow-md' : 'hover:bg-red-600'}`}
            >
              <History size={18} /> History
            </button>
            <button
              onClick={() => setActiveTab('dealers')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${activeTab === 'dealers' ? 'bg-white text-red-700 shadow-md' : 'hover:bg-red-600'}`}
            >
              <LayoutDashboard size={18} /> Dealers Book
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${activeTab === 'settings' ? 'bg-white text-red-700 shadow-md' : 'hover:bg-red-600'}`}
            >
              <SettingsIcon size={18} /> Settings
            </button>
          </nav>
        </div>
      </header>

      {/* Gola Summary Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Total Golas</p>
              <p className="text-xl font-black text-blue-900">{settings.totalStock}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-center">
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">Selled Golas</p>
              <p className="text-xl font-black text-green-900">{selledGolas}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center">
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">Available</p>
              <p className="text-xl font-black text-red-900">{availableGolas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'form' && (
          <ReceiptForm 
            settings={settings} 
            onSave={handleSaveReceipt} 
            onPrint={handlePrint}
            onSaveAndPrint={handleSaveAndPrint}
            onDownloadImage={handleDownloadImage}
          />
        )}
        {activeTab === 'history' && (
          <ReceiptHistory 
            receipts={receipts} 
            onDelete={handleDeleteReceipt} 
            onPrint={handlePrint}
            onUpdateStatus={handleUpdateStatus}
            onDownloadImage={handleDownloadImage}
          />
        )}
        {activeTab === 'dealers' && (
          <DealersBook 
            receipts={receipts} 
          />
        )}
        {activeTab === 'settings' && (
          <Settings 
            settings={settings} 
            onSave={saveSettings} 
          />
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 px-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
        <button
          onClick={() => setActiveTab('form')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'form' ? 'text-red-700 font-bold scale-110' : 'text-gray-400'}`}
        >
          <PlusCircle size={22} />
          <span className="text-[10px]">New</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-red-700 font-bold scale-110' : 'text-gray-400'}`}
        >
          <History size={22} />
          <span className="text-[10px]">History</span>
        </button>
        <button
          onClick={() => setActiveTab('dealers')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dealers' ? 'text-red-700 font-bold scale-110' : 'text-gray-400'}`}
        >
          <LayoutDashboard size={22} />
          <span className="text-[10px]">Dealers</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'settings' ? 'text-red-700 font-bold scale-110' : 'text-gray-400'}`}
        >
          <SettingsIcon size={22} />
          <span className="text-[10px]">Settings</span>
        </button>
      </nav>

      {/* Hidden Printable Receipt */}
      <div className="fixed -left-[9999px] top-0">
        {printingReceipt && <PrintableReceipt receipt={printingReceipt} />}
      </div>
    </div>
  );
}
