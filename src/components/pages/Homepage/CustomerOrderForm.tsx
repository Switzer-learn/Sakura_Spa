import React, { useEffect, useState } from "react";
import * as Components from '../../../components';
import { api } from '../../../services/api';

const CustomerOrderForm: React.FC = () => {
  const [dates, setDates] = useState('');
  const [time, setTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('Male');
  const [originalServices, setOriginalServices] = useState<any[]>([]);
  const [serviceName, setServiceName] = useState<string[]>([]);
  const [serviceDuration, setServiceDuration] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedServiceDuration, setSelectedServiceDuration] = useState<number>();
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [treatmentDescription, setTreatmentDescription] = useState<string>('');
  const [finalService, setFinalService] = useState<any[]>([]);

  const formatPrice = (price:number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchServicesData = async () => {
      const response = await api.getServices();
      const data: any = Array.from(new Set(response?.map(service => service.service_name)));
      setOriginalServices(response || []);
      setServiceName(data || []);
    };
    fetchServicesData();
  }, []);

  useEffect(() => {
    if (!originalServices.length) return;
    const data = originalServices.filter(service => service.service_name === selectedService);
    setFilteredData(data);
    setServiceDuration(data);
    if (data.length) {
      setSelectedServiceDuration(data[0].service_duration);
      setTreatmentDescription(data[0].keterangan);
    }
  }, [selectedService]);

  useEffect(() => {
    const data = filteredData.filter(service => service.service_duration == selectedServiceDuration);
    setFinalService(data);
  }, [selectedServiceDuration]);

  function handleSelectedService(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedService(e.target.value);
  }

  function handleDurationChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedServiceDuration(Number(e.target.value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = {
      customer_name: customerName,
      phone_number: phoneNumber,
      gender,
      date: dates,
      time,
      service: finalService.length ? finalService[0] : {},
    };
    console.log("Submitted Data:", formData);
    // Here you can send `formData` to your API
  }

  return (
    <div id='customerOrderForm' className='flex flex-col items-center p-4'>
      <h1 className='text-3xl font-bold text-blue-700 mb-6 text-center'>Customer Scheduling Form</h1>
      <form className='w-full max-w-3xl bg-white shadow-lg rounded-lg p-6' onSubmit={handleSubmit}>
        <div className='flex flex-col sm:flex-row gap-6'>
          <div className='w-full sm:w-1/2 shadow-md rounded-lg flex flex-col p-4'>
            <span className='text-xl font-semibold mb-4 text-gray-700'>Personal Information</span>
            <div className='flex flex-col'>
              <Components.TextInput id='fullName' label='Full Name' placeholder='Enter Full Name' type='text' required onChange={(e:any) => setCustomerName(e.target.value)} />
              <Components.TextInput id='phoneNumber' label='Phone Number' placeholder='+62' type='text' required onChange={(e:any) => setPhoneNumber(e.target.value)} />
              <div className='mb-4'>
                <label className='font-medium text-gray-700 mb-2 block'>Gender</label>
                <select className='w-full px-3 py-2 border border-gray-300 rounded-md' onChange={(e) => setGender(e.target.value)}>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>
          </div>
          <div className='w-full sm:w-1/2 shadow-md rounded-lg flex flex-col p-4'>
            <span className='text-xl font-semibold mb-4 text-gray-700'>Schedule</span>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col'>
                <label className='font-medium text-gray-700 mb-2'>Date</label>
                <input type='date' onChange={(e) => setDates(e.target.value)} value={dates} className='w-full px-3 py-2 border border-gray-300 rounded-md' required />
              </div>
              <div className='flex flex-col'>
                <label className='font-medium text-gray-700 mb-2'>Time</label>
                <input type='time' onChange={(e) => setTime(e.target.value)} value={time} className='w-full px-3 py-2 border border-gray-300 rounded-md' required />
              </div>
              <div className='flex flex-col'>
                <label className='font-medium text-gray-700 mb-2'>Layanan</label>
                <select onChange={handleSelectedService} value={selectedService || ''} className='w-full px-3 py-2 border border-gray-300 rounded-md'>
                  <option value="" disabled>Select your option</option>
                  {serviceName.map((order, index) => (
                    <option key={index}>{order}</option>
                  ))}
                </select>
                {treatmentDescription && <span className='my-2 text-gray-700'>Keterangan: {treatmentDescription}</span>}
                <label className='font-medium text-gray-700 mb-2'>Durasi</label>
                <select onChange={handleDurationChange} value={selectedServiceDuration || 0} className='w-full px-3 py-2 border border-gray-300 rounded-md'>
                  <option value="" disabled>Select your option</option>
                  {serviceDuration.map((order, index) => (
                    <option key={index} value={order.service_duration}>{order.service_duration}</option>
                  ))}
                </select>
                {finalService.length > 0 && finalService[0]?.service_price && (
                  <span className='text-gray-700'>Harga : Rp.{formatPrice(finalService[0].service_price)},-</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <button type='submit' className='w-full py-3 mt-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default CustomerOrderForm;
