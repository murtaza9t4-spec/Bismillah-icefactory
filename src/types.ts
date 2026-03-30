export interface ReceiptItem {
  type: "Gola";
  qty: number;
  status: "Received" | "Pending";
}

export interface Receipt {
  id: string;
  receiptNo: number;
  date: string;
  customerName: string;
  golaQty: number;
  amountReceived: number;
  outstandingAmount: number;
  totalAmount: number;
  receivedBy: string;
}

export interface Settings {
  golaPrice: number;
  nextReceiptNo: number;
  totalStock: number;
}
