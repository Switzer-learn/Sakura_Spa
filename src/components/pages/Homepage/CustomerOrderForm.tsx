import React, { useEffect, useState } from "react";
import * as Components from "../../../components";
import { api } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import CustomerServiceSelection from "../../testing/CustomerServiceSelection";

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
  const [service, setService] = useState<{ service: string; duration: number; price: number; service_id: number }[]>([]);
  const [total, setTotal] = useState(0);
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
    if (walkIn === false) {
      fetchCurrentUser();
    }
    setLoading(false);
  }, [navigate, walkIn]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  
    let walkInCustomerId = 0;
  
    // Handle walk-in customer registration
    if (walkIn) {
      const customerData = {
        customer_name: customerName,
        phone_number: phoneNumber,
        email: email, // Include email when inserting a walk-in customer
      };

      const getCustomerResponse = await api.getCustomers();
      console.log(getCustomerResponse)
      if(getCustomerResponse.status===200){
        const existingCustomer = getCustomerResponse.data.find((customer:any) => customer.email === customerData.email || customer.phone_number === customerData.phone_number);
        if (!existingCustomer) {
          const response = await api.addWalkInCustomer(customerData);
          if (response.status !== 200) {
            alert("Something is wrong");
            console.log(response);
            return; // Exit if there's an error
          }
  
          if (response.data && response.data[0]?.auth_user_id) {
            walkInCustomerId = response.data[0].auth_user_id;
          } else {
            alert("Failed to retrieve customer ID.");
            return;
          }
        }else{
          walkInCustomerId = existingCustomer.auth_user_id
        }
      }
  
      
    }
  
    // Insert transaction into `transactions` table
    const formData = {
      customer_id: walkIn ? walkInCustomerId : customerId,
      customer_name: customerName,
      phone_number: phoneNumber,
      date: dates,
      therapist_id: null,
      paid: false,
      amount: total,
      time,
    };
  
    console.log("Customer Data:", formData);
    console.log("Selected Service:", service);
    console.log("Total:", total);
  
    const transactionResponse = await api.addOrders(formData);
  
    if (transactionResponse.status === 200 && transactionResponse.data.length > 0) {
      const transactionId = transactionResponse.data[0].transaction_id;
      
      // Insert selected services into `transaction_services` table
      const serviceInsertPromises = service.map((item) =>
        api.addTransactionService({
          transaction_id: transactionId,
          service_id: item.service_id, // Ensure service_id is sent correctly
        })
      );
  
      const serviceResponses = await Promise.all(serviceInsertPromises);
  
      // Check if all service insertions were successful
      const hasErrors = serviceResponses.some((res) => res.status !== 200);
  
      if (hasErrors) {
        alert("Scheduling failed, please try again or contact us via WhatsApp.");
        console.log("service error ",serviceResponses);
        return;
      }
  
      // Success message
      if (walkIn) {
        alert("Scheduling successful!");
        navigate("/AdminPage");
      } else {
        alert("Scheduling successful! Thank you, we look forward to seeing you.");
        navigate("/");
      }
    } else {
      alert("Scheduling failed, please try again or contact us via WhatsApp.");
      console.log("transaction error ",transactionResponse);
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

  const handleFetchService = (services:{ service: string; duration: number; price: number; service_id: number }[],newTotal:number) => {
    console.log(services);
    console.log('Total',newTotal);
    setTotal(newTotal);
    setService(services);
  }

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
    <div className=" bg-green-700">
      {adminPage === false && <Components.Header customerMode={true} />}
      <div id="customerOrderForm" className="flex flex-col items-center h-screen bg-green-700 p-4">
        <form className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
            Customer Scheduling Form
          </h1>
          <div className="flex md:flex-col gap-6 border">
            <div className='flex gap-2 w-full mx-auto border-2'>
            <div className="w-full sm:w-1/2 shadow-md rounded-lg flex flex-col p-4">
              <span className="text-xl font-semibold mb-4 text-gray-700">Personal Information</span>
              <div className="flex flex-col">
                {/* Fields for personal information */}
                <Components.TextInput
                  id="fullName"
                  label="Full Name"
                  placeholder="Enter Full Name"
                  type="text"
                  value={customerName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
                  disabled={!walkIn}
                />
                <Components.TextInput
                  id="phoneNumber"
                  label="Phone Number"
                  placeholder="+62"
                  type="text"
                  value={phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                  disabled={!walkIn}
                />
                {walkIn && (
                  <Components.TextInput
                    id="email"
                    label="Email"
                    placeholder="Enter Email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />
                )}
              </div>
            </div>
            
            <div className="w-full sm:w-1/2 shadow-md rounded-lg flex flex-col p-4">
              <span className="text-xl font-semibold mb-4 text-gray-700">Schedule</span>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    min={today}
                    onChange={(e) => setDates(e.target.value)}
                    value={dates}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-2">Time</label>
                  <select
                    onChange={(e) => setTime(e.target.value)}
                    value={time}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="" disabled>
                      Select a time
                    </option>
                    {validTimeSlots
                      .filter((slot) => dates !== today || slot >= minTime)
                      .map((slot, index) => (
                        <option key={index} value={slot}>
                          {slot}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            </div>
            <CustomerServiceSelection onFetchService={handleFetchService} />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerOrderForm;
