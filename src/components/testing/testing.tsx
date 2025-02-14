import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

interface CustomerOrderFormProps {
  walkIn: boolean;
  adminPage: boolean;
}

const Testing: React.FC<CustomerOrderFormProps> = () => {
  const [originalServices, setOriginalServices] = useState<any[]>([]);
  const [serviceNames, setServiceNames] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<{ service: string; duration: number }[]>([]);

  useEffect(() => {
    const fetchServicesData = async () => {
      const response = await api.getServices();
      const uniqueServices = Array.from(new Set(response?.map(service => service.service_name)));
      setOriginalServices(response || []);
      setServiceNames(uniqueServices || []);
    };
    fetchServicesData();
  }, []);

  const handleServiceChange = (index: number, value: string) => {
    const filteredDurations = originalServices.filter(service => service.service_name === value);
    setSelectedServices(prev => prev.map((item, i) => i === index ? { service: value, duration: filteredDurations[0]?.service_duration || 0 } : item));
  };

  const handleDurationChange = (index: number, value: number) => {
    setSelectedServices(prev => prev.map((item, i) => i === index ? { ...item, duration: value } : item));
  };

  const handleAddService = () => {
    setSelectedServices([...selectedServices, { service: "", duration: 0 }]);
  };

  const handleRemoveService = (index: number) => {
    setSelectedServices(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-screen bg-green-700">
      
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Customer Scheduling Form</h1>
        <div>
          {selectedServices.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              <select onChange={(e) => handleServiceChange(index, e.target.value)} value={item.service} className="border p-2">
                <option value="" disabled>Select Service</option>
                {serviceNames.map((service, i) => <option key={i} value={service}>{service}</option>)}
              </select>
              <select onChange={(e) => handleDurationChange(index, Number(e.target.value))} value={item.duration} className="border p-2">
                <option value="" disabled>Select Duration</option>
                {originalServices.filter(service => service.service_name === item.service).map((order, i) => (
                  <option key={i} value={order.service_duration}>{order.service_duration} minutes</option>
                ))}
              </select>
              <button type="button" className="bg-red-500 text-white p-2" onClick={() => handleRemoveService(index)}>Remove</button>
            </div>
          ))}
          <button type="button" className="bg-green-500 text-white rounded-lg shadow-lg font-bold p-2 mt-2" onClick={handleAddService}>+ Add Service</button>
        </div>
        <button type="submit" className="w-full py-3 mt-6 bg-blue-600 text-white font-semibold rounded-xl">Submit</button>
      
    </div>
  );
};

export default Testing;
