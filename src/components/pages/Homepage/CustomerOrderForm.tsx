import React, { useEffect, useState } from "react";
import * as Components from "../../../components";
import { api } from "../../../services/api";
import { useNavigate } from "react-router-dom";

interface CustomerOrderFormProps {
  walkIn: boolean;
  adminPage: boolean;
}

const CustomerOrderForm: React.FC<CustomerOrderFormProps> = ({ walkIn, adminPage }) => {
  const [dates, setDates] = useState("");
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [originalServices, setOriginalServices] = useState<any[]>([]);
  const [serviceName, setServiceName] = useState<string[]>([]);
  const [serviceDuration, setServiceDuration] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedServiceDuration, setSelectedServiceDuration] = useState<number>();
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [treatmentDescription, setTreatmentDescription] = useState<string>("");
  const [finalService, setFinalService] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(false);
  }, [navigate, walkIn]);

  useEffect(() => {
    const fetchServicesData = async () => {
      const response = await api.getServices();
      const data: any = Array.from(new Set(response?.map((service) => service.service_name)));
      setOriginalServices(response || []);
      setServiceName(data || []);
    };
    fetchServicesData();
  }, []);

  useEffect(() => {
    if (!originalServices.length) return;
    const data = originalServices.filter((service) => service.service_name === selectedService);
    setFilteredData(data);
    setServiceDuration(data);
    if (data.length) {
      setSelectedServiceDuration(data[0].service_duration);
      setTreatmentDescription(data[0].keterangan);
    }
  }, [selectedService, originalServices]);

  useEffect(() => {
    const data = filteredData.filter((service) => service.service_duration === selectedServiceDuration);
    setFinalService(data);
  }, [selectedServiceDuration, filteredData]);

  const today = new Date().toISOString().split("T")[0];

  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 8; hour < 20; hour++) {
      timeSlots.push(`${String(hour).padStart(2, "0")}:00`);
      timeSlots.push(`${String(hour).padStart(2, "0")}:30`);
    }
    return timeSlots;
  };

  const validTimeSlots = generateTimeSlots();
  const minTime =
    dates === today
      ? validTimeSlots.find(
          (slot) =>
            slot >= new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
        ) || "08:00"
      : "08:00";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src="./Sakura_Spa_Logo.png" className="animate-pulse size-52" alt="Loading" />
        <span className="text-lg font-semibold text-gray-700 ml-4">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-700">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Customer Scheduling Form</h1>
        <form className="flex flex-col gap-6">
          <Components.TextInput
            label="Full Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            disabled={!walkIn}
          />
          <Components.TextInput
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={!walkIn}
          />
          {walkIn && <Components.TextInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />}
          <input type="date" min={today} onChange={(e) => setDates(e.target.value)} value={dates} required className="p-2 border rounded-md" />
          <select onChange={(e) => setTime(e.target.value)} value={time} required className="p-2 border rounded-md">
            <option value="" disabled>Select a time</option>
            {validTimeSlots.map((slot, index) => (
              <option key={index} value={slot}>{slot}</option>
            ))}
          </select>
          <button type="submit" className="py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CustomerOrderForm;
