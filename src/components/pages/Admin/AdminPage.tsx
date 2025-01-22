import React from "react";
import * as Component from "../../../components";

const AdminPage: React.FC = () => {
  return (
    <div className='flex'>
      <div className='items-start'>
        <Component.AdminSideMenu />
      </div>
      <div className='mx-auto'>
        <Component.EmployeeRegistration />
      </div>
    </div>
  );
};

export default AdminPage;
