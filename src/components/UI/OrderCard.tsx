import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { downloadInvoice } from '../../utils/InvoicePDF';

type TransactionCardProps = {
  customerName: string;
  schedule: string; // Format: "YYYY-MM-DD HH:mm"
  service: string;
  duration: number; // e.g., "60 minutes"
  therapistName: string | null; // Therapist may be null
  paid: boolean;
  id: string;
  amount: number;
  paymentMethod: string | null;
  onPayment: () => void;
  onEdit: (changedData: { therapist_id: string, transaction_id: string }) => void;
};

const TransactionCard: React.FC<TransactionCardProps> = ({
  customerName,
  schedule,
  service,
  duration,
  therapistName,
  paid,
  amount,
  paymentMethod,
  id,
  onPayment,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [therapistOptions, setTherapistOptions] = useState<any[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(therapistName);

  // Fetch therapist options
  useEffect(() => {
    const fetchTherapists = async () => {
      const therapists = await api.getTherapist();
      setTherapistOptions(therapists || []);
    };

    fetchTherapists();
  }, []);

  const handleSave = () => {
    if (selectedTherapist) {
      const data = {
        therapist_id: selectedTherapist,
        transaction_id: id,
      };
      onEdit(data);
      setIsEditing(false);
    } else {
      console.log("Therapist must be selected before saving.");
    }
  };

  const getCardColor = () => {
    if (!therapistName) {
      return 'bg-red-200'; // Light red if no therapist assigned
    } else if (!paid) {
      return 'bg-yellow-200'; // Yellow if not paid
    } else {
      return 'bg-green-200'; // Green if paid and therapist is assigned
    }
  };

  const handleDownloadInvoice = () => {
    const transaction = {
      transaction_id: id,
      customer_name: customerName,
      service_name: service,
      service_price: amount,
      service_duration: duration,
      payment_method: paymentMethod || 'N/A',
    };
    downloadInvoice(transaction);
  };

  return (
    <div className={`${getCardColor()} shadow-md rounded-2xl p-4 w-full max-w-md mx-auto border m-2`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{customerName}</h3>
        {paid === true && (
          <div className="relative group">
            <button
              onClick={handleDownloadInvoice}
              className="text-blue-500 text-sm underline focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                <path d="M 7 2 L 7 48 L 43 48 L 43 14.59375 L 42.71875 14.28125 L 30.71875 2.28125 L 30.40625 2 Z M 9 4 L 29 4 L 29 16 L 41 16 L 41 46 L 9 46 Z M 31 5.4375 L 39.5625 14 L 31 14 Z M 15 22 L 15 24 L 35 24 L 35 22 Z M 15 28 L 15 30 L 31 30 L 31 28 Z M 15 34 L 15 36 L 35 36 L 35 34 Z"></path>
              </svg>
            </button>
            <span className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              Download Invoice
            </span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mt-1">
        <span className="font-semibold">Schedule:</span> {schedule}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <span className="font-semibold">Service:</span> {service}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <span className="font-semibold">Duration:</span> {duration}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <span className="font-semibold">Therapist:</span> {therapistName || 'Not assigned'}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <span className="font-semibold">Paid:</span> {paid ? 'Sudah Bayar' : 'Belum Bayar'}
      </p>

      {isEditing && (
        <div className="mt-4">
          <label htmlFor="therapist" className="font-medium text-gray-700 mb-2">
            Assign Therapist
          </label>
          <select
            id="therapist"
            value={selectedTherapist || ''}
            onChange={(e) => setSelectedTherapist(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>Select a therapist</option>
            {therapistOptions.map((therapist) => (
              <option key={therapist.employee_id} value={therapist.employee_id}>
                {therapist.full_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end mt-4 gap-2">
        {!paid && (
          <>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-yellow-600 focus:outline-none"
              >
                Edit
              </button>
            )}

            <button
              onClick={onPayment}
              className="bg-green-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-green-600 focus:outline-none"
            >
              Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
