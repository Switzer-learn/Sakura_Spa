/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

interface CustomerServiceSelectionProps {
  onFetchService: (services: { service: string; duration: number; price: number; service_id: number }[], totalAmount: number) => void;
}

const CustomerServiceSelection: React.FC<CustomerServiceSelectionProps> = ({ onFetchService }) => {
  const [originalServices, setOriginalServices] = useState<any[]>([]);
  const [serviceNames, setServiceNames] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<{ service: string; duration: number; price: number; service_id: number }[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchServicesData = async () => {
      const response = await api.getServices();
      const uniqueServices = Array.from(new Set(response?.map(service => service.service_name)));
      setOriginalServices(response || []);
      setServiceNames(uniqueServices || []);
    };
    fetchServicesData();
  }, []);

  useEffect(() => {
    const newTotal = selectedServices.reduce((acc, curr) => acc + curr.price, 0);
    setTotalAmount(newTotal);
    onFetchService(selectedServices, newTotal);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServices]);

  const handleServiceChange = (index: number, value: string) => {
    const filteredDurations = originalServices.filter(service => service.service_name === value);
    setSelectedServices(prev =>
      prev.map((item, i) =>
        i === index
          ? {
              service: value,
              duration: filteredDurations[0]?.service_duration || 0,
              price: filteredDurations[0]?.service_price || 0,
              service_id: filteredDurations[0]?.service_id ?? 0, // Ensure service_id is always a number
            }
          : item
      )
    );
  };

  const handleDurationChange = (index: number, value: number) => {
    setSelectedServices(prev =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              duration: value,
              price: originalServices.find(service => service.service_name === item.service && service.service_duration === value)?.service_price || 0,
              service_id:
                originalServices.find(service => service.service_name === item.service && service.service_duration === value)?.service_id ?? 0, // Ensure service_id is always a number
            }
          : item
      )
    );
  };

  const handleAddService = () => {
    setSelectedServices([...selectedServices, { service: "", duration: 0, price: 0, service_id: 0 }]); // Default service_id to 0
  };

  const handleRemoveService = (index: number) => {
    setSelectedServices(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 max-h-40 overflow-y-auto">
      <div>
        <div className="grid grid-cols-4 text-lg font-semibold text-center">
          <span>Service</span>
          <span>Duration</span>
          <span>Harga</span>
          <span>Hapus</span>
        </div>
        {selectedServices.map((item, index) => (
          <div key={index} className="grid grid-cols-4 my-2 text-gray-800">
            <select onChange={(e) => handleServiceChange(index, e.target.value)} value={item.service} className="border p-2 rounded-lg shadow-md">
              <option value="" disabled>Select Service</option>
              {serviceNames.map((service, i) => (
                <option key={i} value={service}>
                  {service}
                </option>
              ))}
            </select>
            <select onChange={(e) => handleDurationChange(index, Number(e.target.value))} value={item.duration} className="mx-auto border p-2 rounded-lg shadow-md">
              <option value="" disabled>
                Select Duration
              </option>
              {originalServices
                .filter(service => service.service_name === item.service)
                .map((order, i) => (
                  <option key={i} value={order.service_duration}>
                    {order.service_duration} minutes
                  </option>
                ))}
            </select>
            <span className="p-2 text-center">Rp.{formatPrice(item.price)},-</span>
            <button type="button" className="bg-red-500 text-white p-2 w-28 text-center rounded-lg mx-auto" onClick={() => handleRemoveService(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="bg-green-500 text-white rounded-lg shadow-lg font-bold p-2 mt-2" onClick={handleAddService}>
          + Add Service
        </button>
      </div>
      <div className="flex justify-end font-bold text-gray-800">
        <span>Total: Rp.{formatPrice(totalAmount)},-</span>
      </div>
    </div>
  );
};

export default CustomerServiceSelection;
