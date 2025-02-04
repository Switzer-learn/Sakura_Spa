import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

type TransactionCardProps = {
  customerName: string;
  schedule: string; // Format: "YYYY-MM-DD HH:mm"
  service: string;
  duration: string; // e.g., "60 minutes"
  therapistName: string | null; // Therapist may be null
  paid: boolean;
  id: string;
  onSelect: () => void;
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
  id,
  onSelect,
  onPayment,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [therapistOptions, setTherapistOptions] = useState<any[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(therapistName);
  const [currentTherapist, setCurrentTherapist] = useState<string | null>(therapistName);
  const [currentPaidStatus, setCurrentPaidStatus] = useState(paid);

  // Fetch therapist options
  useEffect(() => {
    const fetchTherapists = async () => {
      const therapists = await api.getTherapist();
      setTherapistOptions(therapists || []);
    };

    fetchTherapists();
  }, []);

  // Handle therapist update and payment status
  useEffect(() => {
    if (therapistName !== currentTherapist || paid !== currentPaidStatus) {
      setCurrentTherapist(therapistName);
      setCurrentPaidStatus(paid);
    }
  }, [therapistName, paid]);

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
    if (!currentTherapist) {
      return 'bg-red-200'; // Light red if no therapist assigned
    } else if (!currentPaidStatus) {
      return 'bg-yellow-200'; // Yellow if not paid
    } else {
      return 'bg-green-200'; // Green if paid and therapist is assigned
    }
  };

  return (
    <div className={`${getCardColor()} shadow-md rounded-2xl p-4 w-full max-w-md mx-auto border m-2`}>
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
        <span className="font-semibold">Therapist:</span> {currentTherapist || 'Not assigned'}
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
