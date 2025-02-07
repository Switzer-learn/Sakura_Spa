import { useState } from "react";
import { api } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const response = await api.updatePassword(password);
    if(response.status===200){
        setIsSubmitted(true);
        setMessage('New Password updated')
        navigate('/Login')
    }else{
        alert(`Password update failed, ${response.message}`)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h2 className="text-xl text-center font-semibold mb-4">Reset Your Password</h2>
        <img src='/assets/images/3275434.jpg' alt='forgot password image' className='size-40 mx-auto'/>
        {isSubmitted ? (
          <p className="text-green-600">{message}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Enter your new Password:
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="submit"
              value="Submit"
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md cursor-pointer hover:bg-blue-700"
            />
          </form>
        )}
      </div>
    </div>
  );
}
