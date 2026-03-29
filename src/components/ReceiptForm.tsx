import React from 'react';
import { Receipt, Settings } from '../types';
import { Printer, Save, Trash2, Download } from 'lucide-react';
import { cn } from '../lib/utils';

interface ReceiptFormProps {
  settings: Settings;
  onSave: (receipt: Receipt) => void;
  onPrint: (receipt: Receipt) => void;
  onSaveAndPrint: (receipt: Receipt) => void;
  onDownloadImage: (receipt: Receipt) => void;
}

export default function ReceiptForm({ settings, onSave, onPrint, onSaveAndPrint, onDownloadImage }: ReceiptFormProps) {
  const [formData, setFormData] = React.useState<Partial<Receipt>>({
    receiptNo: settings.nextReceiptNo,
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    golaQty: 0,
    paymentStatus: 'Paid',
    totalAmount: 0,
    receivedBy: ''
  });

  React.useEffect(() => {
    const total = (formData.golaQty || 0) * settings.golaPrice;
    setFormData(prev => ({ ...prev, totalAmount: total }));
  }, [formData.golaQty, settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReceipt: Receipt = {
      ...formData as Receipt,
      id: crypto.randomUUID(),
    };
    onSave(newReceipt);
    // Reset form
    setFormData({
      receiptNo: settings.nextReceiptNo + 1,
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      golaQty: 0,
      paymentStatus: 'Paid',
      totalAmount: 0,
      receivedBy: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border-2 border-red-600 max-w-2xl mx-auto">
      <div className="text-center mb-6 border-b-2 border-red-600 pb-4">
        <h1 className="text-3xl font-bold text-red-700 mb-1 font-sindhi">بسم اللّه آئيس فيڪٽري رستم</h1>
        <h2 className="text-xl font-bold text-red-600 mb-2">Bismillah Ice Factory Rustam</h2>
        <div className="flex justify-center gap-4 text-sm font-semibold text-gray-600">
          <span>0302-3934191</span>
          <span>0312-2091238</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Receipt No / <span className="font-sindhi">نمبر</span>
          </label>
          <input
            type="number"
            name="receiptNo"
            value={formData.receiptNo}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 outline-none transition-all font-bold text-red-700"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Date / <span className="font-sindhi">تاریخ</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 outline-none transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Customer Name / <span className="font-sindhi">نالو</span>
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter customer name"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-100 md:col-span-2">
          <h3 className="font-bold text-red-700 border-b border-red-200 pb-2 text-center">Ice Gola / <span className="font-sindhi">گولا</span></h3>
          <div className="max-w-xs mx-auto">
            <label className="block text-xs font-bold text-gray-500 mb-1 text-center">Qty / <span className="font-sindhi">تعداد</span></label>
            <input
              type="number"
              name="golaQty"
              value={formData.golaQty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-center font-bold text-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Total Amount / <span className="font-sindhi">رقم</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 font-bold text-gray-400">Rs.</span>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 outline-none transition-all font-bold text-xl text-red-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Payment Status / <span className="font-sindhi">ادائيگي جي صورتحال</span>
          </label>
          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            className={cn(
              "w-full px-4 py-2 border-2 rounded-lg focus:border-red-500 outline-none transition-all font-bold",
              formData.paymentStatus === 'Paid' ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
            )}
          >
            <option value="Paid">Paid / ادا ٿيل</option>
            <option value="Pending">Pending / باقي</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Received By / <span className="font-sindhi">صحیح وصول کندڙ</span>
          </label>
          <input
            type="text"
            name="receivedBy"
            value={formData.receivedBy}
            onChange={handleChange}
            placeholder="Collector name"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          type="submit"
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
        >
          <Save size={24} />
          <div className="text-left">
            <p className="text-xs uppercase tracking-widest opacity-80">Action</p>
            <p className="text-lg">Save Receipt / <span className="font-sindhi">محفوظ ڪريو</span></p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => {
            const newReceipt: Receipt = {
              ...formData as Receipt,
              id: crypto.randomUUID(),
            };
            onSaveAndPrint(newReceipt);
          }}
          className="bg-gray-900 hover:bg-black text-white font-black py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
        >
          <Printer size={24} />
          <div className="text-left">
            <p className="text-xs uppercase tracking-widest opacity-80">Export</p>
            <p className="text-lg">Save & Print / <span className="font-sindhi">محفوظ ۽ پرنٽ</span></p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => {
            const newReceipt: Receipt = {
              ...formData as Receipt,
              id: crypto.randomUUID(),
            };
            onDownloadImage(newReceipt);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
        >
          <Download size={24} />
          <div className="text-left">
            <p className="text-xs uppercase tracking-widest opacity-80">Image</p>
            <p className="text-lg">Download / <span className="font-sindhi">ڊائون لوڊ</span></p>
          </div>
        </button>
      </div>
    </form>
  );
}
