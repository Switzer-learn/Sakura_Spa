import React, { useState,useEffect } from 'react';
import { api } from '../../../services/api';
import { useNavigate } from 'react-router-dom'
import * as Components from '../../../components'

const CustomerRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const navigate = useNavigate();

  useEffect(()=>{
    const fetchCurrentUser = async ()=>{
      const currentUser = await api.getCurrentUser();
      if(currentUser){
        navigate('/Booking');
      }
    }
    fetchCurrentUser();
  },[])

  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password || !formData.phoneNumber) {
      setSubmissionStatus('All fields are required.');
      return;
    }

    const phonePattern = /^08\d{7,13}$/;
    if (!phonePattern.test(formData.phoneNumber)) {
      setSubmissionStatus('Invalid phone number. Must start with 08 and be 8-14 digits long.');
      return;
    }

    try {
      const response = await api.customerRegister(formData);
      if (response.status === 200) {
        alert('Registration successful, please check your email and confirm your registration');
        setSubmissionStatus('Registration successful, please check your email and confirm your registration');
      } else if (response.status === '23505') {
        setSubmissionStatus('User already exist, go to login page.');
      } else {
        setSubmissionStatus('Failed to register. Please try again.');
      }
    } catch (error) {
      setSubmissionStatus('An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className='bg-green-700 w-screen text-white'>
    <Components.Header />
    <div className="max-w-lg mx-auto my-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200 md:max-w-md lg:max-w-xl">
      <img src='./Sakura_Spa_Logo.png' alt='logo' className='size-40 mx-auto my-2' />
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Customer Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            pattern="08\d{7,13}"
            title="Phone number must start with 08 and be 8-14 digits long."
            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Register
        </button>
      </form>

      {submissionStatus && (
        <p className="mt-4 text-center text-sm text-gray-600">{submissionStatus}</p>
      )}
    </div>
    </div>
  );
};

export default CustomerRegistration;
