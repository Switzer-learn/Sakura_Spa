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
  const [email, setEmail] = useState(""); // New email state for walkIn users
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    async function fetchCurrentUser() {
      const response = await api.getCurrentUser();
      if (response) {
        setCustomerId(response.id);
        const customerData = await api.getSpecificCustomer(response.id);
        if (customerData) {
          setCustomerName(customerData.data.customer_name);
          setPhoneNumber(customerData.data.phone_number);
          // Optionally, if the non-walkIn user has an email, set it here.
          // setEmail(customerData.data.email);
        }
      } else {
        navigate("/Login");
      }
    }
    if (walkIn === false) {
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

  function handleSelectedService(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedService(e.target.value);
  }

  function handleDurationChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedServiceDuration(Number(e.target.value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let walkInCustomerId = 0;
    if (walkIn) {
      const customerData = {
        customer_name: customerName,
        phone_number: phoneNumber,
        email: email // Include email when inserting a walk-in customer
      };
      const response = await api.addWalkInCustomer(customerData);
      if (response.status !== 200) {
        alert("Something is wrong");
        console.log(response);
        return; // Exit if there's an error
      } else {
        console.log(response)
        if(response.data){
          if (response.data[0]?.auth_user_id) {
          walkInCustomerId = response.data[0].auth_user_id;
        } else {
          alert("Failed to retrieve customer ID.");
          return;
        }
        }
        
      }
    }
    const formData = {
      customer_id: walkIn ? walkInCustomerId : customerId,
      customer_name: customerName,
      phone_number: phoneNumber,
      date: dates,
      therapist_id: null,
      paid: false,
      time,
      service: finalService.length ? finalService[0] : {},
    };
    console.log("Submitted Data:", formData);
    const response = await api.addOrders(formData);
    console.log(response);

    if (response.status === 200) {
      if(walkIn){
        alert("Scheduling berhasil");
        navigate("/AdminPage");
      }else{
        alert("Scheduling berhasil, Terima Kasih, kami tunggu kedatangan anda");
        navigate("/");
      }
      
    } else {
      alert("Scheduling gagal, coba lagi atau hubungi kami melalui whatsapp");
      console.log(response);
    }
  }

  // Restrict past dates
  const today = new Date().toISOString().split("T")[0];

  // Generate valid time slots (8 AM - 7 PM in 30-minute increments)
  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 8; hour < 20; hour++) {
      timeSlots.push(`${String(hour).padStart(2, "0")}:00`);
      timeSlots.push(`${String(hour).padStart(2, "0")}:30`);
    }
    return timeSlots;
  };

  // Valid time slots based on date
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
      <div className="flex flex-col justify-center items-center h-screen">
        <img
          src="./Sakura_Spa_Logo.png"
          className="animate-pulse size-52 flex my-auto mx-auto"
          alt="Loading"
        />
        <span className="text-lg font-semibold text-gray-700">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-700 p-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Customer Scheduling Form</h1>
        <form onSubmit={() => {}}>
          <div className="flex flex-col gap-6">
            <div className="shadow-md rounded-lg flex flex-col p-4">
              <span className="text-xl font-semibold mb-4 text-gray-700">Personal Information</span>
              <Components.TextInput id="fullName" label="Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <Components.TextInput id="phoneNumber" label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              {walkIn && <Components.TextInput id="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />}
            </div>
            <div className="shadow-md rounded-lg flex flex-col p-4">
              <span className="text-xl font-semibold mb-4 text-gray-700">Schedule</span>
              <input type="date" value={dates} onChange={(e) => setDates(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              <select onChange={(e) => setTime(e.target.value)} value={time} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="" disabled>Select a time</option>
                <option value="08:00">08:00</option>
                <option value="08:30">08:30</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-3 mt-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CustomerOrderForm;
