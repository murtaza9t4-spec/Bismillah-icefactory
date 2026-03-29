import React from 'react';
import { Receipt } from '../types';
import { Printer, Trash2, Search, Calendar, User, CheckCircle2, XCircle, Download } from 'lucide-react';
import { cn } from '../lib/utils';

interface ReceiptHistoryProps {
  receipts: Receipt[];
  onDelete: (id: string) => void;
  onPrint: (receipt: Receipt) => void;
  onUpdateStatus?: (id: string, status: 'Paid' | 'Pending') => void;
  onDownloadImage: (receipt: Receipt) => void;
}

export default function ReceiptHistory({ receipts, onDelete, onPrint, onUpdateStatus, onDownloadImage }: ReceiptHistoryProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredReceipts = receipts.filter(r => 
    r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.receiptNo.toString().includes(searchTerm)
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-red-700 flex items-center gap-2">
          <span className="text-xl">📜</span> Receipt History / تاریخ
        </h2>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search name or no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
          />
        </div>
      </div>

      {filteredReceipts.length === 0 ? (
        <div className="text-center py-12 text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-xl">
          No records found / کوئی ریکارڈ نہیں ملا
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <th className="px-3 py-2 font-bold text-xs uppercase">No.</th>
                <th className="px-3 py-2 font-bold text-xs uppercase">Date</th>
                <th className="px-3 py-2 font-bold text-xs uppercase">Customer Name</th>
                <th className="px-3 py-2 font-bold text-xs uppercase text-right">Amount</th>
                <th className="px-3 py-2 font-bold text-xs uppercase text-center">Status</th>
                <th className="px-3 py-2 font-bold text-xs uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 font-bold text-red-600">#{receipt.receiptNo}</td>
                  <td className="px-3 py-3 text-sm text-gray-500 whitespace-nowrap">{receipt.date}</td>
                  <td className="px-3 py-3 font-bold text-gray-800">{receipt.customerName}</td>
                  <td className="px-3 py-3 text-right font-black text-gray-900">Rs. {receipt.totalAmount}</td>
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => onUpdateStatus?.(receipt.id, receipt.paymentStatus === 'Paid' ? 'Pending' : 'Paid')}
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter transition-all",
                        receipt.paymentStatus === 'Paid' 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {receipt.paymentStatus}
                    </button>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onDownloadImage(receipt)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Download Image"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => onPrint(receipt)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Print"
                      >
                        <Printer size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(receipt.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
