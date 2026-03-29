import React from 'react';
import { Receipt } from '../types';
import { User, TrendingUp, Package, CreditCard } from 'lucide-react';

interface DealersBookProps {
  receipts: Receipt[];
}

export default function DealersBook({ receipts }: DealersBookProps) {
  // Group receipts by customer name
  const dealerStats = receipts.reduce((acc, receipt) => {
    const name = receipt.customerName;
    if (!acc[name]) {
      acc[name] = {
        name,
        totalGolas: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        receiptCount: 0
      };
    }
    
    acc[name].totalGolas += receipt.golaQty;
    acc[name].totalAmount += receipt.totalAmount;
    acc[name].receiptCount += 1;
    
    if (receipt.paymentStatus === 'Paid') {
      acc[name].paidAmount += receipt.totalAmount;
    } else {
      acc[name].pendingAmount += receipt.totalAmount;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const dealers = Object.values(dealerStats).sort((a, b) => b.totalAmount - a.totalAmount);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-red-700 flex items-center gap-3">
          <span className="bg-red-100 p-2 rounded-xl">📖</span>
          Dealers Book / <span className="font-sindhi">ڊيلر بڪ</span>
        </h2>
        <p className="text-gray-500 mt-2">Track sales and payments for each dealer</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {dealers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <User className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-bold">No dealer data available yet</p>
          </div>
        ) : (
          dealers.map((dealer: any) => (
            <div key={dealer.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-black text-xl">
                      {dealer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{dealer.name}</h3>
                      <p className="text-sm text-gray-500">{dealer.receiptCount} Total Receipts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Sales</p>
                    <p className="text-2xl font-black text-red-700">Rs. {dealer.totalAmount}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Package size={14} />
                      <span className="text-[10px] font-bold uppercase">Golas</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{dealer.totalGolas}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <TrendingUp size={14} />
                      <span className="text-[10px] font-bold uppercase">Paid</span>
                    </div>
                    <p className="text-lg font-bold text-green-700">Rs. {dealer.paidAmount}</p>
                  </div>

                  <div className="bg-red-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-red-600 mb-1">
                      <CreditCard size={14} />
                      <span className="text-[10px] font-bold uppercase">Pending</span>
                    </div>
                    <p className="text-lg font-bold text-red-700">Rs. {dealer.pendingAmount}</p>
                  </div>
                </div>
              </div>
              
              {dealer.pendingAmount > 0 && (
                <div className="bg-red-600 px-6 py-2 text-white text-center text-xs font-bold uppercase tracking-widest">
                  Outstanding Balance Detected
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
