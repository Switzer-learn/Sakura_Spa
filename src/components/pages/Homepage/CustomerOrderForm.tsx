import React, { useState } from "react";
import * as Components from '../..'

const CustomerOrderForm: React.FC = () => {
  const [dates, setDates] = useState('');
  const [time, setTime] = useState('');

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
