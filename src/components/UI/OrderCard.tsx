import React from 'react';

type TransactionCardProps = {
  customerName: string;
  schedule: string; // Format: "YYYY-MM-DD HH:mm"
  service: string;
  duration: string; // e.g., "60 minutes"
  therapistName: string;
  onSelect: () => void;
  onEdit: () => void;
  onPayment: () => void;
};

const TransactionCard: React.FC<TransactionCardProps> = ({
  customerName,
  schedule,
  service,
  duration,
  therapistName,
  onSelect,
  onEdit,
  onPayment,
}) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-md mx-auto border m-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{customerName}</h3>
        <button
          onClick={onSelect}
          className="text-blue-500 text-sm underline focus:outline-none"
        >
          Select
        </button>
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
        <span className="font-semibold">Therapist:</span> {therapistName}
      </p>
      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={onEdit}
          className="bg-yellow-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-yellow-600 focus:outline-none"
        >
          Edit
        </button>
        <button
          onClick={onPayment}
          className="bg-green-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-green-600 focus:outline-none"
        >
          Payment
        </button>
      </div>
    </div>
  );
};

export default TransactionCard;
