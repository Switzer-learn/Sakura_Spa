import React, { useState } from "react";
import * as Component from "../../../components";

const AdminPage: React.FC = () => {
  const [selectedMenu,setSelectedMenu] = useState('')

  const handleSideMenuClick = (menu:string) =>{
    setSelectedMenu(menu);
  }

  const displayContent = () =>{
    switch (selectedMenu) {
      case "AddEmployee":
        return <Component.EmployeeRegistration />
      case "EmployeeList":
        return <Component.EmployeeList /> //need to be displayed with many employee
      case "addInventory":
        return <Component.AddInventoryForm />
      case "inventoryList":
        return <Component.InventoryList />
      case "revenueReport":
        return <Component.RevenueReport />
      case "cashier":
        return <Component.CashierPage />
      case "schedule":
        return <div>Schedule</div>
      case "testing":
        return <Component.LoginPage /> 
      case "customerList":
        return <Component.CustomerList />       // Add more cases as needed for other menu options
      default:
        return <div>Select a menu option</div>
    }
  }
  return (
    <div className='flex'>
      <div className='items-start'>
        <Component.AdminSideMenu onMenuClick={handleSideMenuClick} />
      </div>
      <div className='bg-linear-to-r from-red-500 to-green-500 w-screen'>
        <div className='mx-auto '>
          {displayContent()}
        </div>
      </div>
    </div>

  );
};

export default AdminPage;
