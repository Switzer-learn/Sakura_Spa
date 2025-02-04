import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="px-4 flex justify-between text-center py-2 ">
      <div className="flex gap-2 align-middle">
        <img src="./Sakura_Spa_Logo.png" alt="logo" className="size-10" />
        <span className="text-2xl font-bold py-1">Sakura Spa</span>
      </div>
      <div className="flex align-middle gap-4">
        <Link to='/'>Home</Link>
        <a href='#aboutUs'>About Us</a>
        <button>Our Service</button>
        <button>Contact Us</button>
      </div>
      <div className="flex align-middle gap-3">
        <Link to='/Login' className="rounded border bg-blue-500 hover:bg-blue-600 px-3 py-2">Login</Link>
        <Link to='/Register' className="rounded border px-3 py-2">Register</Link>
      </div>
    </header>
  );
};

export default Header;
