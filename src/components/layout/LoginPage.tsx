import { useState, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import * as Components from '../../components';
import { api } from '../../services/api';

interface LoginPageProps {
  staffLogin?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ staffLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Function to fetch the current user and redirect based on the user's role.
  async function fetchAndRedirectUser() {
    const user = await api.getCurrentUser();
    if (user) {
      console.log(user)
      // First, check if the user is in the customer table.
      const customer = await api.getSpecificCustomer(user.id);
      if (customer.status==200) {
        navigate('/Booking');
      } else {
        // If not found in customer table, check if the user is an admin.
        const admin = await api.checkAdminRole(user.id);
        if (admin.status === 200) {
          navigate('/adminPage');
        } else {
          // If the user is neither a customer nor an admin, redirect to homepage.
          navigate('/');
        }
      }
    }
  }

  // Run the user check on initial component mount.
  useEffect(() => {
    fetchAndRedirectUser();
    // Adding navigate to dependency array to satisfy linting rules.
  }, [navigate]);

  // Handle login form submission.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { email, password };

    // Attempt to log in the user.
    const response = await api.login(formData);
    if (response.status === 200) {
      alert('Login Successful');

      // After successful login, re-run the user fetch and redirection logic.
      await fetchAndRedirectUser();
    } else {
      alert('Login Failed');
      console.error(response.message);
    }
  };

  return (
    <div className='text-white bg-gradient-to-br from-green-700 to-green-500 min-h-screen'>
      {/* Optionally show the header if not on staffLogin page */}
      {staffLogin !== true && <Components.Header customerMode={true} />}
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
          <img src='./Sakura_Spa_Logo.png' className='mx-auto w-40 h-auto' alt='Logo' />
          <h2 className="text-3xl font-extrabold text-center text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-center">Sign in to your account</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-10 py-3 text-gray-800 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-10 py-3 text-gray-800 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex justify-between text-sm text-gray-500">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-indigo-500" /> Remember me
              </label>
              <a href="#" className="hover:text-indigo-500">Forgot password?</a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Sign In
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-gray-500">
            Don't have an account? <a href="/Register" className="text-indigo-600 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
