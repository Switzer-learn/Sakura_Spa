import React, { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "./components/layout/LoginPage"
import ResetPassword from './components/pages/Homepage/ResetPassword';

// Lazy-loaded components
const HomePage = lazy(() => import("./components/pages/Homepage/HomePage"));
//const LoginPage = lazy(() => import("./components/layout/LoginPage"));
const CustomerRegistrationForm = lazy(() => import("./components/pages/Homepage/CustomerRegistrationForm"));
const CustomerOrderForm = lazy(() => import("./components/pages/Homepage/CustomerOrderForm"));
const AdminPage = lazy(() => import("./components/pages/Admin/AdminPage"));
const EmployeeRegistrationForm = lazy(()=> import("./components/layout/Admin/EmployeeRegistration"))

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Login" element={<LoginPage staffLogin={false} />} />
          <Route path="/Register" element={<CustomerRegistrationForm />} />
          <Route path="/Booking" element={<CustomerOrderForm walkIn={false} adminPage={false}/>} />
          <Route path="/employee" element={<LoginPage staffLogin={true} />} />
          <Route path="/AdminPage" element={<AdminPage />} />
          <Route path="/AdminRegister" element={<EmployeeRegistrationForm adminLogin={true} />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
