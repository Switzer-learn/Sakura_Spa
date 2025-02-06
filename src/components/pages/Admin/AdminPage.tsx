import React, { useState, lazy, Suspense, useEffect } from "react";
import AdminSideMenu from '../../layout/Admin/AdminSideMenu';
import { useNavigate } from 'react-router-dom'
import { api } from '../../../services/api';

// Lazy load components
const EmployeeRegistration = lazy(() => import("../../layout/Admin/EmployeeRegistration"));
const EmployeeList = lazy(() => import("../../layout/Admin/EmployeeList"));
const AddInventoryForm = lazy(() => import("../../layout/Admin/AddInventoryForm"));
const InventoryList = lazy(() => import("../../layout/Admin/InventoryList"));
const RevenueReport = lazy(() => import("../../layout/Admin/RevenueReport"));
const CashierPage = lazy(() => import("../../layout/Admin/CashierPage"));
const TherapistSchedule = lazy(() => import("../../layout/Admin/TherapistSchedule"));
const CustomerOrderForm = lazy(() => import("../../pages/Homepage/CustomerOrderForm"));
const CustomerList = lazy(() => import("../../layout/Admin/CustomerList"));
const ServiceList = lazy(()=> import("../../layout/Admin/ServiceList"))


const AdminPage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    const getCurrentUser=async ()=>{
      const currentUser = await api.getCurrentUser();
      
      if(currentUser){
        const response = await api.checkAdminRole(currentUser.id);
        if(response?.status!==200){
          alert('Unauthorized access');
          navigate('/employee');
          await api.logout();
        }
      }else{
        alert('Unauthorized access');
        navigate('/employee')
      }
    }
    getCurrentUser();
  },[])
  
  const handleSideMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  const displayContent = () => {
    switch (selectedMenu) {
      case "AddEmployee":
        return <EmployeeRegistration adminLogin={false}/>;
      case "EmployeeList":
        return <EmployeeList />;
      case "addInventory":
        return <AddInventoryForm />;
      case "inventoryList":
        return <InventoryList />;
      case "revenueReport":
        return <RevenueReport />;
      case "cashier":
        return <CashierPage />;
      case "schedule":
        return <TherapistSchedule />;
      case "serviceList":
        return <ServiceList />;
      case "Walk-in Customer Order":
        return <CustomerOrderForm walkIn={true}/>;
      case "customerList":
        return <CustomerList />;
      default:
        return <CashierPage />;
    }
  };

  return (
    <div className="flex">
      <div className="items-start">
        <AdminSideMenu onMenuClick={handleSideMenuClick} />
      </div>
      <div className="bg-linear-to-r from-red-500 to-green-500 w-screen">
        <div className="mx-auto">
          <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
            {displayContent()}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
