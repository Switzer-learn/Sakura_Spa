import React, { useState } from 'react';
import axios from 'axios';

// Define the type for the form data
interface CustomerFormData {
  name: string;
  username: string;
  password: string;
  phoneNumber: string;
}

const CustomerRegistration: React.FC = () => {
  // State to manage form data
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    username: '',
    password: '',
    phoneNumber: '',
  });

  // State to handle form submission status
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.username || !formData.password || !formData.phoneNumber) {
      setSubmissionStatus('All fields are required.');
      return;
    }

    try {
      // Replace with your backend API endpoint
      const response = await axios.post('https://your-backend-api.com/customers', formData);

      if (response.status === 201) {
        setSubmissionStatus('Customer registered successfully!');
        // Clear the form
        setFormData({
          name: '',
          username: '',
          password: '',
          phoneNumber: '',
        });
      } else {
        setSubmissionStatus('Failed to register customer. Please try again.');
      }
    } catch (error) {
      setSubmissionStatus('An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Customer Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number:
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Register
        </button>
      </form>

      {submissionStatus && (
        <p className="mt-4 text-center text-sm text-gray-600">{submissionStatus}</p>
      )}
    </div>
  );
};

export default CustomerRegistration;