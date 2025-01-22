const Header = () => {
  return (
    <header className="px-4 flex justify-between text-center py-2 ">
      <div className="flex gap-2 align-middle">
        <img src="./Sakura_Spa_Logo.png" alt="logo" className="size-10" />
        <span className="text-2xl font-bold py-1">Sakura Spa</span>
      </div>
      <div className="flex align-middle gap-4">
        <button>Home</button>
        <button>About Us</button>
        <button>Our Service</button>
        <button>Contact Us</button>
      </div>
      <div className="flex align-middle gap-3">
        <button className="rounded border bg-blue-500 hover:bg-blue-600 px-3 py-2">Login</button>
        <button className="rounded border px-3 py-2">Register</button>
      </div>
    </header>
  );
};

export default Header;
