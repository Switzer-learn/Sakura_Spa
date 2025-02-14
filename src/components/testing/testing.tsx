import React, { useEffect, useState } from "react";
import * as Components from "../../components";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

interface CustomerOrderFormProps {
  walkIn: boolean;
  adminPage: boolean;
}

const Testing: React.FC<CustomerOrderFormProps> = ({ walkIn, adminPage }) => {
  const [dates, setDates] = useState("");
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [originalServices, setOriginalServices] = useState<any[]>([]);
  const [serviceNames, setServiceNames] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<{ service: string; duration: number }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCurrentUser() {
      const response = await api.getCurrentUser();
      if (response) {
        setCustomerId(response.id);
        const customerData = await api.getSpecificCustomer(response.id);
        if (customerData) {
          setCustomerName(customerData.data.customer_name);
          setPhoneNumber(customerData.data.phone_number);
        }
      } else {
        navigate("/Login");
      }
    }
    if (!walkIn) {
      fetchCurrentUser();
    }
  }, [navigate, walkIn]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let walkInCustomerId = 0;
    if (walkIn) {
      const customerData = { customer_name: customerName, phone_number: phoneNumber, email };
      const response = await api.addWalkInCustomer(customerData);
      if (response.status !== 200 || !response.data[0]?.auth_user_id) {
        alert("Failed to retrieve customer ID.");
        return;
      }
      walkInCustomerId = response.data[0].auth_user_id;
    }

    const formData = {
      customer_id: walkIn ? walkInCustomerId : customerId,
      customer_name: customerName,
      phone_number: phoneNumber,
      date: dates,
      time,
      services: selectedServices,
    };
    const response = await api.addOrders(formData);
    if (response.status === 200) {
      alert("Scheduling berhasil");
      navigate(walkIn ? "/AdminPage" : "/");
    } else {
      alert("Scheduling gagal, coba lagi.");
    }
  }

  return (
    <div className="w-screen bg-green-700">
      <form className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6" onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
};

export default Testing;
