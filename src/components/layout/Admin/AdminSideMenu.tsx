import { useState } from "react";

const AdminSideMenu = (props: any) => {
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // For mobile responsiveness
  const [serviceOpen, setServiceOpen] = useState(false);

  return (
    <div>
      {/* Mobile menu toggle */}
      <button
        className="md:hidden p-3 text-white bg-green-800 fixed top-4 left-4 z-50 rounded-lg"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "Close Menu" : "Open Menu"}
      </button>

      <div
        id="sideMenu"
        className={`${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform transform fixed md:static flex flex-col w-64 h-auto min-h-screen bg-green-800 z-40`}
      >
        {/* Logo Section */}
        <div className="flex flex-col justify-center align-middle my-5">
          <img
            src="./Sakura_Spa_Logo.png"
            alt="sakura spa logo"
            className="w-28 h-28 self-center rounded-full border-2 border-white"
          />
          <span className="text-center text-2xl font-bold text-white">
            Sakura Spa
          </span>
        </div>

        {/* Menu Section */}
        <div className="flex flex-col justify-center gap-3 my-10 mx-auto font-bold text-white">
          <span className="text-center text-xl">Menu</span>
          <div>
            <div>
              <button
                className="w-full text-left py-2 px-4 hover:bg-green-700"
                onClick={() => setEmployeeOpen(!employeeOpen)}
              >
                Employee Management
              </button>
              {employeeOpen && (
                <ul className="px-4 text-md font-normal flex flex-col">
                  <button
                    className="hover:text-lg text-start py-1 px-2"
                    onClick={() => props.onMenuClick("AddEmployee")}
                  >
                    Add Employee
                  </button>
                  <button
                    className="hover:text-lg text-start py-1  px-2"
                    onClick={() => props.onMenuClick("EmployeeList")}
                  >
                    Employee List
                  </button>
                </ul>
              )}
            </div>
            <div>
              <button
                className="w-full text-left py-2 px-4 hover:bg-green-700"
                onClick={() => setInventoryOpen(!inventoryOpen)}
              >
                Inventory
              </button>
              {inventoryOpen && (
                <ul className="px-4 text-md font-normal flex flex-col">
                  <button
                    className="hover:text-lg text-start py-1 px-2"
                    onClick={() => props.onMenuClick("addInventory")}
                  >
                    Add Inventory
                  </button>
                  <button
                    className="hover:text-lg text-start py-1 px-2"
                    onClick={() => props.onMenuClick("inventoryList")}
                  >
                    Inventory List
                  </button>
                </ul>
              )}
            </div>
            <div>
              <button
                className="w-full text-left py-2 px-4 hover:bg-green-700"
                onClick={() => setServiceOpen(!serviceOpen)}
              >
                Service
              </button>
              {serviceOpen && (
                <ul className="px-4 text-md font-normal flex flex-col">
                  <button
                    className="hover:text-lg text-start py-1 px-2"
                    onClick={() => props.onMenuClick("addService")}
                  >
                    Add Service
                  </button>
                  <button
                    className="hover:text-lg text-start py-1 px-2"
                    onClick={() => props.onMenuClick("serviceList")}
                  >
                    Service List
                  </button>
                </ul>
              )}
            </div>
            <div>
              <button
                className="w-full text-left py-2 px-4 hover:bg-green-700"
                onClick={() => setFinanceOpen(!financeOpen)}
              >
                Finance
              </button>
              {financeOpen && (
                <ul className="px-4 text-md font-normal">
                  <button
                    className="hover:text-lg text-start py-1 px-2"
                    onClick={() => props.onMenuClick("revenueReport")}
                  >
                    Revenue Report
                  </button>
                </ul>
              )}
            </div>
            <div>
              <button
                className="w-full text-left py-2 px-4 hover:bg-green-700"
                onClick={() => props.onMenuClick("cashier")}
              >
                Cashier
              </button>
            </div>
            <div>
              <button
                className="w-full text-left py-2 px-4 hover:bg-green-700"
                onClick={() => props.onMenuClick("schedule")}
              >
                Schedule
              </button>
            </div>
            <div>
              <button
                className="w-full text-left py-2 px-4 hover:bg-green-700"
                onClick={() => props.onMenuClick("customerList")}
              >
                Customer List
              </button>
            </div>
            
            <div>
              <button
                className="w-full text-left py-2 px-4 hover:bg-green-700"
                onClick={() => props.onMenuClick("testingRegister")}
              >
                Testing Register
              </button>
            </div>
            <div>
              <button
                className="w-full text-left py-2 px-4 hover:bg-green-700"
                onClick={() => props.onMenuClick("testingCustomerOrder")}
              >
                Testing Customer Order
              </button>
            </div>
            <div>
              <button
                className="w-full text-left py-2 px-4 hover:bg-green-700"
                onClick={() => console.log('log out')}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background overlay for mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminSideMenu;
