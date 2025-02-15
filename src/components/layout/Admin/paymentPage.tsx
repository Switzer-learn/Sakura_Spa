import React from "react";
import * as Components from "../../../components";
import { downloadInvoice } from "../../../utils/InvoicePDF"; // adjust the path as needed
import { api } from '../../../services/api'

interface PaymentPageProps {
  customer_name: string;
  service_name: string;
  service_price: number;
  service_duration: number;
  transaction_id: string;
  open: boolean;
  onClose: () => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(price);
};

const PaymentPage: React.FC<PaymentPageProps> = ({
  customer_name,
  service_name,
  service_price,
  service_duration,
  transaction_id,
  open,
  onClose,
}) => {
  const [paymentMethod, setPaymentMethod] = React.useState<string>("cash");

  const handleConfirmPayment = async () => {

    // Create a transaction object with all necessary fields for the invoice
    const transaction = {
      transaction_id,
      customer_name,
      service_name,
      service_price,
      service_duration,
      payment_method: paymentMethod,
    };

    const response = await api.processPayment({transaction_id:transaction_id,paid:true,payment_method:paymentMethod});
    if(response.status==200){
      alert('Pembayaran berhasil');
      downloadInvoice(transaction);
      onClose();
    }else{
      alert('Pembayaran gagal, cek console');
      console.log(response.message);
    }
    
    
  };

  return (
    <Components.Dialog open={open} onOpenChange={onClose}>
      <Components.DialogContent>
        <Components.DialogHeader>
          <Components.DialogTitle className="text-center">
            Confirm Payment
          </Components.DialogTitle>
        </Components.DialogHeader>

        <div className="flex flex-col gap-4">
          <p>
            <strong>Customer:</strong> {customer_name}
          </p>
          <p>
            <strong>Service:</strong> {service_name}
          </p>
          <p>
            <strong>Duration:</strong> {service_duration} min
          </p>
          <p>
            <strong>Price:</strong> Rp {formatPrice(service_price)}
          </p>

          <label className="font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="cash">Cash</option>
            <option value="qris">QRIS</option>
          </select>
        </div>

        <Components.DialogFooter>
          <button
            onClick={handleConfirmPayment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Confirm Payment & Download Invoice
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </Components.DialogFooter>
      </Components.DialogContent>
    </Components.Dialog>
  );
};

export default PaymentPage;
