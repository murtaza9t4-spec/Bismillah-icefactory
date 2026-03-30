import React from 'react';
import { Receipt } from '../types';

interface PrintableReceiptProps {
  receipt: Receipt;
}

export default function PrintableReceipt({ receipt }: PrintableReceiptProps) {
  return (
    <div id="printable-receipt" className="p-10 bg-white border-[12px] border-red-600 max-w-[800px] mx-auto text-black font-sans relative overflow-hidden">
      <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 text-xs font-black uppercase tracking-widest rounded-bl-xl z-20">
        رسيد
      </div>

      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none rotate-[-45deg]">
        <span className="text-[120px] font-black whitespace-nowrap">BISMILLAH ICE</span>
      </div>

      <div className="text-center mb-8 border-b-4 border-red-600 pb-6 relative z-10">
        <h1 className="text-5xl font-bold text-red-700 mb-2 font-sindhi">بسم اللّه آئيس فيڪٽري رستم</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-10 text-3xl font-bold">
        <div className="flex justify-between items-center border-b-2 border-gray-300 pb-2">
          <div className="flex items-center gap-2 w-full justify-end">
            <span className="text-gray-900">{receipt.receiptNo}</span>
            <span className="text-red-700 font-sindhi">رسيد نمبر:</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center border-b-2 border-gray-300 pb-2">
          <div className="flex items-center gap-2 w-full justify-end">
            <span className="text-gray-900">{receipt.date}</span>
            <span className="text-red-700 font-sindhi">تاريخ:</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-b-2 border-gray-300 pb-2">
          <div className="flex items-center gap-2 w-full justify-end">
            <span className="text-gray-900">{receipt.customerName}</span>
            <span className="text-red-700 font-sindhi">نالو:</span>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="border-4 border-red-600 p-8 rounded-xl bg-red-50 max-w-2xl mx-auto shadow-inner">
          <h3 className="text-4xl font-black text-red-700 mb-8 border-b-2 border-red-200 pb-4 text-center font-sindhi">
            گولا جا تفصيل
          </h3>
          
          <div className="flex justify-between items-center text-3xl font-bold mb-6 px-4">
            <div className="flex items-center gap-2">
              <span className="text-red-700 text-4xl">{receipt.golaQty}</span>
              <span className="text-gray-600 font-sindhi">تعداد:</span>
            </div>
          </div>

          <div className="space-y-4 border-t-2 border-red-200 pt-6">
            <div className="flex justify-between items-center text-3xl font-bold px-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-900">Rs. {(receipt.totalAmount || 0).toLocaleString()}</span>
                <span className="text-gray-600 font-sindhi">ڪل رقم:</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-3xl font-bold px-4">
              <div className="flex items-center gap-2">
                <span className="text-green-600">Rs. {(receipt.amountReceived || 0).toLocaleString()}</span>
                <span className="text-green-700 font-sindhi">مليل:</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-4xl font-black px-4 border-t-4 border-red-600 pt-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-red-600">Rs. {(receipt.outstandingAmount || 0).toLocaleString()}</span>
                <span className="text-red-700 font-sindhi">بقايا:</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 items-end mt-20">
        <div className="text-center">
          <div className="border-b-4 border-gray-400 mb-2 h-24 flex items-end justify-center text-4xl font-bold italic text-gray-700">
            {receipt.receivedBy}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold text-red-700 font-sindhi">صحيح وصول ڪندڙ</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-red-700 text-white p-8 rounded-3xl shadow-2xl transform rotate-1">
            <div className="flex justify-between items-center mb-2 border-b border-red-500 pb-2">
              <span className="text-sm font-bold font-sindhi">ڪل بقايا</span>
            </div>
            <span className="text-6xl font-black">Rs. {(receipt.outstandingAmount || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-gray-400 text-sm italic font-bold border-t border-gray-100 pt-4 font-sindhi">
        آپ کے تعاون کا شکریہ!
      </div>
    </div>
  );
}
