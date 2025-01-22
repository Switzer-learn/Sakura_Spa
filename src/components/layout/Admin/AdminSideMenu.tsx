import { useState } from "react";

const AdminSideMenu =()=>{
  const [employeeOpen,setEmployeeOpen] = useState(false);
  const [inventoryOpen,setInventoryOpen] = useState(false);
  const [financeOpen,setFinanceOpen] = useState(false);


  return(
    <div id="sideMenu" className="flex flex-col border w-64 h-screen">
      <div className='flex flex-col border justify-center align-middle my-5'>
        <img src="./Sakura_Spa_Logo.png" alt='sakura spa logo' className="size-28 self-center" />
        <span className='text-center text-2xl font-bold'>Sakura Spa</span>
      </div>
      <div className='flex flex-col justify-center gap-3 my-10 mx-auto font-bold'>
        <span className="text-center text-xl">Menu</span>
        <div>
          <div>
            <button onClick={()=>setEmployeeOpen(!employeeOpen)} >Employee Management</button>
            {employeeOpen==true &&(
              <ul className="px-4 text-md font-normal">
                <li>Add Employee</li>
                <li>Employee List</li>
              </ul>
            )}
            
          </div>
          <div>
            <button onClick={()=>setInventoryOpen(!inventoryOpen)}>Inventory</button>
            {inventoryOpen===true&&(
              <ul className="px-4 text-md font-normal">
              <li>Add Inventory</li>
              <li>Inventory List</li>
            </ul>
            )}
          </div>
          <div>
            <button onClick={()=>setFinanceOpen(!financeOpen)}>Finance</button>
            {financeOpen===true&&(
              <ul className="px-4 text-md font-normal">
              <li>Revenue Report</li>
            </ul>
            )}
          </div>
          <div>
            <span>Cashier</span>
          </div>
          <div>
            <span>Schedule</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSideMenu;