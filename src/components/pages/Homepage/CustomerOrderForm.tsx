import React, { useEffect, useState } from "react";
import * as Components from '../../../components'
import {api} from '../../../services/api'

const CustomerOrderForm: React.FC = () => {
  const [dates, setDates] = useState('');
  const [time, setTime] = useState('');
  const [originalServices,setOriginalServices] = useState<any[]>([]);
  const [selectedServiceName,setSelectedServiceName] = useState<string>('Full Body Massage')
  const [selectedService,setSelectedService] = useState<string[]>([]);
  const [selectedServiceDuration,setSelectedServiceDuration] = useState<any[]>([]);

  useEffect(()=>{
    const fetchServicesData = async()=>{
      const response = await api.getServices();
      const data:any = Array.from(new Set(response?.map((services)=>{
        return services.service_name;
      })));
      setOriginalServices(data || [])
      console.log(data);
    }
    fetchServicesData();
  },[])

  useEffect(()=>{
    console.log(selectedServiceName)
    const data:any = originalServices.filter((service)=>{
      service === selectedServiceName;
    })
    setSelectedServiceDuration(data);
  },[selectedServiceName])

  function handleSelectedService(e:any){
    setSelectedServiceName(e.target.value);
    console.log(e.target.value)
  }

  function handleDurationChange(e:any){
    setSelectedServiceDuration(e.target.value);
    console.log(e.target.value)
  }


  return (
    <div id='customerOrderForm' className='flex flex-col items-center p-4'>
      <h1 className='text-3xl font-bold text-blue-700 mb-6 text-center'>Customer Scheduling Form</h1>
      <form action="submit" method="post" className='w-full max-w-3xl bg-white shadow-lg rounded-lg p-6'>
        <div className='flex flex-col sm:flex-row gap-6'>
          <div className='w-full sm:w-1/2 shadow-md rounded-lg flex flex-col p-4'>
            <span className='text-xl font-semibold mb-4 text-gray-700'>Personal Information</span>
            <div className='flex flex-col'>
              <Components.TextInput id='fullName' label='Full Name' placeholder='Enter Full Name' type='text' required />
              <Components.TextInput id='phoneNumber' label='Phone Number' placeholder='+62' type='text' required />
              <div className='mb-4'>
                <label className='font-medium text-gray-700 mb-2 block'>Gender</label>
                <select className='w-full px-3 py-2 border border-gray-300 rounded-md'>
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
                <input
                  type='date'
                  onChange={(e) => setDates(e.target.value)}
                  value={dates}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  required
                />
              </div>
              <div className='flex flex-col'>
                <label className='font-medium text-gray-700 mb-2'>Time</label>
                <input
                  type='time'
                  onChange={(e) => setTime(e.target.value)}
                  value={time}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  required
                />
              </div>
              <div className='flex flex-col'>
                <label className='font-medium text-gray-700 mb-2'>Layanan</label>
                <select onChange={handleSelectedService} value={selectedServiceName}>
                  {originalServices.map((order,index)=>(
                    <option key={index}>{order}</option>
                  ))}
                </select>
                <label className='font-medium text-gray-700 mb-2'>Durasi</label>
                <select onChange={handleDurationChange} value={selectedServiceDuration||0}>
                  {selectedServiceDuration.map((order,index)=>(
                    <option key={index}>{order.service_duration}</option>
                  ))}
                </select>
                <label className='font-medium text-gray-700 mb-2'>Durasi</label>
                <select>
                  {originalServices.map((order)=>(
                    <option>{order.service_name}</option>
                  ))}
                </select>
                
              </div>
            </div>
          </div>
        </div>
        <button type='submit' className='w-full py-3 mt-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700'>
          Submit
        </button>
      </form>
      <div className='text-sm text-gray-600 mt-4'>
        <span className='block mb-2'>Note:</span>
        <span>- Operational hours: 8:00 AM - 8:00 PM</span>
      </div>
    </div>
  );
};

export default CustomerOrderForm;
