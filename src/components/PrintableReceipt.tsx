import React from 'react';
import { Receipt } from '../types';

interface PrintableReceiptProps {
  receipt: Receipt;
}

export default function PrintableReceipt({ receipt }: PrintableReceiptProps) {
  return (
    <div id="printable-receipt" className="p-10 bg-white border-[12px] border-red-600 max-w-[800px] mx-auto text-black font-sans relative overflow-hidden">
      <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 text-xs font-black uppercase tracking-widest rounded-bl-xl z-20">
        Official Receipt
      </div>

      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none rotate-[-45deg]">
        <span className="text-[120px] font-black whitespace-nowrap">BISMILLAH ICE</span>
      </div>

      <div className="text-center mb-8 border-b-4 border-red-600 pb-6 relative z-10">
        <h1 className="text-5xl font-bold text-red-700 mb-2 font-sindhi">بسم اللّه آئيس فيڪٽري رستم</h1>
        <h2 className="text-3xl font-bold text-red-600 mb-4">Bismillah Ice Factory Rustam</h2>
        <div className="flex justify-center gap-8 text-xl font-bold text-gray-700">
          <span>0302-3934191</span>
          <span>0312-2091238</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-10 text-3xl font-bold">
        <div className="flex justify-between border-b-2 border-gray-300 pb-2">
          <span className="text-red-700">Receipt No / <span className="font-sindhi">نمبر</span>:</span>
          <span>{receipt.receiptNo}</span>
        </div>
        <div className="flex justify-between border-b-2 border-gray-300 pb-2">
          <span className="text-red-700">Date / <span className="font-sindhi">تاریخ</span>:</span>
          <span>{receipt.date}</span>
        </div>
      </div>

      <div className="mb-10 text-3xl font-bold border-b-2 border-gray-300 pb-2">
        <span className="text-red-700">Customer Name / <span className="font-sindhi">نالو</span>:</span>
        <span className="ml-4">{receipt.customerName}</span>
      </div>

      <div className="mb-10">
        <div className="border-4 border-red-600 p-8 rounded-xl bg-red-50 max-w-md mx-auto">
          <h3 className="text-4xl font-bold text-red-700 mb-6 border-b-2 border-red-200 pb-2 text-center">Ice Gola / <span className="font-sindhi">گولا</span></h3>
          <div className="flex justify-between text-3xl font-bold mb-4">
            <span>Qty / <span className="font-sindhi">تعداد</span>:</span>
            <span>{receipt.golaQty}</span>
          </div>
          <div className="flex justify-between text-3xl font-bold mt-4 border-t border-red-200 pt-4">
            <span>Payment / <span className="font-sindhi">ادائيگي</span>:</span>
            <span className={receipt.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'}>
              {receipt.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 items-end mt-12">
        <div className="text-center">
          <div className="border-b-4 border-gray-400 mb-2 h-16 flex items-end justify-center text-2xl font-bold italic text-gray-600">
            {receipt.receivedBy}
          </div>
          <span className="text-xl font-bold text-red-700">Received By / <span className="font-sindhi">صحیح وصول کندڙ</span></span>
        </div>
        
        <div className="bg-red-700 text-white p-6 rounded-2xl text-center shadow-xl">
          <span className="text-xl font-bold block mb-1">Total Amount / <span className="font-sindhi">رقم</span></span>
          <span className="text-5xl font-black">Rs. {receipt.totalAmount}</span>
        </div>
      </div>

      <div className="mt-16 text-center text-gray-400 text-sm italic font-bold border-t border-gray-100 pt-4">
        Thank you for your business! / <span className="font-sindhi text-xs">آپ کے تعاون کا شکریہ!</span>
      </div>
    </div>
  );
}
