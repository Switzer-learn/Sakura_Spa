import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Import Font Awesome icons
import { api } from "../../../services/api"; // Assuming you have an api.js file for your API calls
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await api.getCurrentUser(); // API call to get current user
        if (currentUser) {
          const customerData = await api.getSpecificCustomer(currentUser.id);
          if (customerData) {
            setUser(customerData.data.customer_name);
          }
        }
         // If user exists, set it in the state
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    // Call the logout API here (or clear local storage/session)
    api.logout();
    setUser(null); // Clear the user state
    navigate('/');
  };

  return (
    <header className="px-4 md:px-10 flex justify-between items-center py-4 relative">
      {/* Left Logo */}
      <div className="flex items-center gap-2">
        <img src="./Sakura_Spa_Logo.png" alt="logo" className="size-10" />
        <span className="text-2xl font-bold">Sakura Spa</span>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6">
        <Link to="/" className="hover:text-blue-500 transition">Home</Link>
        <a href="#aboutUs" className="hover:text-blue-500 transition">About Us</a>
        <a href="#serviceSection" className="hover:text-blue-500 transition">Our Service</a>
        <button className="hover:text-blue-500 transition">Contact Us</button>
      </nav>

      {/* Auth Buttons (Desktop) */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <>
            <span className="text-lg">Welcome, {user}</span>
            <button onClick={handleLogout} className="rounded border bg-red-500 hover:bg-red-600 px-3 py-2 text-white">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/Login" className="rounded border bg-blue-500 hover:bg-blue-600 px-3 py-2 text-white">
              Login
            </Link>
            <Link to="/Register" className="rounded border px-3 py-2">
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-gray-800"
        aria-label="Toggle Menu"
      >
        {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />} {/* Replaced Lucide icons with Font Awesome */}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 flex flex-col items-center space-y-4 md:hidden z-50">
          <Link to="/" className="hover:text-blue-500 transition" onClick={() => setIsOpen(false)}>Home</Link>
          <a href="#aboutUs" className="hover:text-blue-500 transition" onClick={() => setIsOpen(false)}>About Us</a>
          <a href="#serviceSection" className="hover:text-blue-500 transition" onClick={() => setIsOpen(false)}>Our Service</a>
          <button className="hover:text-blue-500 transition" onClick={() => setIsOpen(false)}>Contact Us</button>
          {user ? (
            <>
              <span className="text-lg">Welcome, {user}</span>
              <button onClick={handleLogout} className="rounded border bg-red-500 hover:bg-red-600 px-4 py-2 w-3/4 text-center">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/Login" className="rounded border bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white w-3/4 text-center" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/Register" className="rounded border px-4 py-2 w-3/4 text-center" onClick={() => setIsOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
