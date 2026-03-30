import React from 'react';
import { Receipt } from '../types';
import { User, TrendingUp, Package, CreditCard, Download, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DealersBookProps {
  receipts: Receipt[];
}

export default function DealersBook({ receipts }: DealersBookProps) {
  const [startDate, setStartDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [selectedDealer, setSelectedDealer] = React.useState('All');

  // Get unique dealer names for dropdown
  const allDealerNames = Array.from(new Set(receipts.map(r => r.customerName.trim()))).sort();

  // Filter receipts by date range and selected dealer
  const filteredReceipts = receipts.filter(r => {
    const receiptDate = r.date;
    const dateMatch = receiptDate >= startDate && receiptDate <= endDate;
    const dealerMatch = selectedDealer === 'All' || r.customerName.trim() === selectedDealer;
    return dateMatch && dealerMatch;
  });

  // Group receipts by customer name
  const dealerStats = filteredReceipts.reduce((acc, receipt) => {
    const name = receipt.customerName.trim();
    if (!acc[name]) {
      acc[name] = {
        name,
        totalGolas: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        receiptCount: 0,
        individualReceipts: [] as Receipt[]
      };
    }
    
    acc[name].totalGolas += (Number(receipt.golaQty) || 0);
    acc[name].totalAmount += (Number(receipt.totalAmount) || 0);
    acc[name].receiptCount += 1;
    acc[name].paidAmount += (Number(receipt.amountReceived) || 0);
    acc[name].pendingAmount = acc[name].totalAmount - acc[name].paidAmount;
    acc[name].individualReceipts.push(receipt);
    
    return acc;
  }, {} as Record<string, any>);

  const dealers = Object.values(dealerStats).sort((a, b) => b.totalAmount - a.totalAmount);

  const downloadPDFReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38); // Red-600
    doc.text('Bismillah Ice Factory Rustam', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    const reportTitle = selectedDealer === 'All' 
      ? `Sales Summary Report: ${startDate} to ${endDate}`
      : `Dealer Statement: ${selectedDealer} (${startDate} to ${endDate})`;
    doc.text(reportTitle, 105, 30, { align: 'center' });

    if (selectedDealer === 'All') {
      // Summary Table for all dealers
      const tableData = dealers.map(d => [
        d.name,
        d.totalGolas,
        `Rs. ${(d.totalAmount || 0).toLocaleString()}`,
        `Rs. ${(d.paidAmount || 0).toLocaleString()}`,
        `Rs. ${(d.pendingAmount || 0).toLocaleString()}`
      ]);

      const totals = dealers.reduce((acc, d) => ({
        golas: acc.golas + d.totalGolas,
        total: acc.total + d.totalAmount,
        paid: acc.paid + d.paidAmount,
        pending: acc.pending + d.pendingAmount
      }), { golas: 0, total: 0, paid: 0, pending: 0 });

      tableData.push([
        'GRAND TOTAL',
        totals.golas,
        `Rs. ${(totals.total || 0).toLocaleString()}`,
        `Rs. ${(totals.paid || 0).toLocaleString()}`,
        `Rs. ${(totals.pending || 0).toLocaleString()}`
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Dealer Name', 'Total Golas', 'Total Amount', 'Amount Received', 'Outstanding Amount']],
        body: tableData,
        headStyles: { fillColor: [220, 38, 38] },
        theme: 'grid',
        didParseCell: (data) => {
          if (data.row.index === tableData.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [245, 245, 245];
          }
        }
      });
    } else {
      // Detailed Table for a single dealer
      const dealer = dealers[0];
      if (!dealer) return;

      // Sort receipts by date (oldest first for statement)
      const sortedReceipts = [...dealer.individualReceipts].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const tableData = sortedReceipts.map((r: Receipt) => [
        r.date,
        `#${r.receiptNo}`,
        r.golaQty,
        `Rs. ${(r.totalAmount || 0).toLocaleString()}`,
        `Rs. ${(r.amountReceived || 0).toLocaleString()}`,
        `Rs. ${(r.outstandingAmount || 0).toLocaleString()}`
      ]);

      tableData.push([
        'TOTAL',
        '',
        dealer.totalGolas,
        `Rs. ${(dealer.totalAmount || 0).toLocaleString()}`,
        `Rs. ${(dealer.paidAmount || 0).toLocaleString()}`,
        `Rs. ${(dealer.pendingAmount || 0).toLocaleString()}`
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Date', 'Receipt #', 'Total Golas', 'Total Amount', 'Amount Received', 'Outstanding Amount']],
        body: tableData,
        headStyles: { fillColor: [220, 38, 38] },
        theme: 'grid',
        didParseCell: (data) => {
          if (data.row.index === tableData.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [245, 245, 245];
          }
        }
      });
    }

    const fileName = selectedDealer === 'All' 
      ? `Sales_Report_${startDate}_to_${endDate}.pdf`
      : `Statement_${selectedDealer}_${startDate}_to_${endDate}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-red-700 flex items-center gap-3">
            <span className="bg-red-100 p-2 rounded-xl">📖</span>
            Dealers Book / <span className="font-sindhi">ڊيلر بڪ</span>
          </h2>
          <p className="text-gray-500 mt-2">Track sales and payments for each dealer</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 flex flex-col gap-4 w-full md:w-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Select Dealer</label>
              <select
                value={selectedDealer}
                onChange={(e) => setSelectedDealer(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-red-500 outline-none font-bold"
              >
                <option value="All">All Dealers / سڀ ڊيلر</option>
                {allDealerNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">From</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">To</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-red-500 outline-none"
              />
            </div>
          </div>
          <button 
            onClick={downloadPDFReport}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Download size={18} />
            {selectedDealer === 'All' ? 'Download Summary PDF' : `Download ${selectedDealer}'s PDF`}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 font-sindhi">ٽوٽل کنيل گولا</p>
          <p className="text-2xl font-black text-gray-900">
            {dealers.reduce((sum, d) => sum + d.totalGolas, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 font-sindhi">ٽوٽل رقم</p>
          <p className="text-2xl font-black text-red-700">
            Rs. {dealers.reduce((sum, d) => sum + d.totalAmount, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 font-sindhi">مليل رقم</p>
          <p className="text-2xl font-black text-green-600">
            Rs. {dealers.reduce((sum, d) => sum + d.paidAmount, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 font-sindhi">بقايا رقم</p>
          <p className="text-2xl font-black text-red-600">
            Rs. {dealers.reduce((sum, d) => sum + d.pendingAmount, 0)}
          </p>
        </div>
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
