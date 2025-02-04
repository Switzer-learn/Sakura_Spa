import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import {api} from '../../services/api'


const LoginPage = ({staffLogin}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
    const formData = {
      email:email,
      password:password
    }
    const response = await api.login(formData);
    if(response.status===200){
      alert('Login Successfull');
      console.log(response.user);
    }else{
      alert('Login failed')
      console.log(response.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-700 to-green-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <img src='./Sakura_Spa_Logo.png' className='size-40 mx-auto' alt='logo' />
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 text-center">Sign in to your account</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
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

          {/* Forgot Password */}
          <div className="flex justify-between text-sm text-gray-500">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-indigo-500" /> Remember me
            </label>
            <a href="#" className="hover:text-indigo-500">Forgot password?</a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-gray-500">
          Don't have an account? <a href="#" className="text-indigo-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
