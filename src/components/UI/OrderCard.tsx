import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { downloadInvoice } from '../../utils/InvoicePDF';

type Service = {
  service_name: string;
  service_price: number;
  service_duration: number;
};

type TransactionCardProps = {
  transaction_id: string;
  customer_name: string;
  schedule: string;
  therapist_name: string | null;
  paid: boolean;
  amount: number;
  payment_method: string | null;
  services: Service[];
  total_duration: number;
  onPayment: () => void;
  onEdit: (changedData: { therapist_id: number, transaction_id: string }) => void;
};

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction_id,
  customer_name,
  schedule,
  therapist_name,
  paid,
  amount,
  payment_method,
  services,
  total_duration,
  onPayment,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [therapistOptions, setTherapistOptions] = useState<any[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(therapist_name);
  const [estimatedFinishTime,setEstimatedFinishTime] = useState<string>('');

  useEffect(() => {
    const fetchTherapists = async () => {
      const therapists = await api.getTherapist();
      setTherapistOptions(therapists || []);
    };
    fetchTherapists();
  }, []);

  const handleSave = () => {
    if (selectedTherapist) {
      onEdit({ therapist_id: parseInt(selectedTherapist), transaction_id });
      //console.log(selectedTherapist)
      setIsEditing(false);
    }
  };

  const getCardColor = () => {
    if (!therapist_name) return 'bg-red-200';
    if (!paid) return 'bg-yellow-200';
    return 'bg-green-200';
  };

  const handleDelete = async ()=>{
    confirm("Are you sure you want to delete this transaction?");
    const response = await api.deleteTransaction({transaction_id})
    if(response.status===200){
      alert('Transaction successfully deleted');
    }
    window.location.reload();
  }

  const handleDownloadInvoice = () => {
    const transaction = {
      transaction_id,
      customer_name,
      services,
      amount,
      total_duration,
      payment_method: payment_method || 'N/A',
    };
    downloadInvoice(transaction);
  };

  useEffect(() => {
    const scheduleTime = schedule.split('T')[1];
    const finishTime = calculateFinishTime(scheduleTime, total_duration);
    setEstimatedFinishTime(finishTime);
  }, [schedule, total_duration]);

  function calculateFinishTime(startTime: string, duration: number): string {
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    
    const finishHours = Math.floor(totalMinutes / 60);
    const finishMinutes = totalMinutes % 60;
    
    const formattedHours = finishHours.toString().padStart(2, '0');
    const formattedMinutes = finishMinutes.toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
  }

  return (
    <div className={`${getCardColor()} shadow-md rounded-2xl p-4 w-full max-w-md mx-auto border m-2`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{customer_name}</h3>
        <div>
          <button onClick={handleDelete} className='bg-red-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-red-600 focus:outline-none'>Delete</button>
        </div>
        {paid && (
          <button
            onClick={handleDownloadInvoice}
            className="text-blue-500 text-sm underline focus:outline-none"
          >
            Download Invoice
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600"><span className="font-semibold">Schedule:</span> {schedule}</p>
      <p className="text-sm text-gray-600"><span className="font-semibold">Estimated Finish Time:</span> {estimatedFinishTime}</p>
      <p className="text-sm text-gray-600"><span className="font-semibold">Therapist:</span> {therapist_name || 'Not assigned'}</p>
      <p className="text-sm text-gray-600"><span className="font-semibold">Total Duration:</span> {total_duration} min</p>
      <p className="text-sm text-gray-600"><span className="font-semibold">Total Amount:</span> Rp {amount.toLocaleString()}</p>
      
      <div className="mt-2">
        <span className="font-semibold">Services:</span>
        <ul className="list-disc ml-5 text-sm text-gray-600">
          {services.map((service, index) => (
            <li key={index}>{service.service_name} - Rp {service.service_price.toLocaleString()} ({service.service_duration} min)</li>
          ))}
        </ul>
      </div>

      {isEditing && (
        <div className="mt-4">
          <label htmlFor="therapist" className="font-medium text-gray-700 mb-2">Assign Therapist</label>
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
              <button onClick={handleSave} className="bg-blue-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-600 focus:outline-none">Save</button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-yellow-600 focus:outline-none">Edit</button>
            )}
            <button onClick={onPayment} className="bg-green-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-green-600 focus:outline-none">Payment</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
