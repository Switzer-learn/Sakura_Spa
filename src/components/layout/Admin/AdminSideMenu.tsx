import { useState } from "react";

const AdminSideMenu =(props:any)=>{
  const [employeeOpen,setEmployeeOpen] = useState(false);
  const [inventoryOpen,setInventoryOpen] = useState(false);
  const [financeOpen,setFinanceOpen] = useState(false);

  return(
    <div id="sideMenu" className="flex flex-col w-64 h-screen bg-green-800">
      <div className='flex flex-col justify-center align-middle my-5'>
        <img src="./Sakura_Spa_Logo.png" alt='sakura spa logo' className="size-28 self-center rounded-full border-2 border-white" />
        <span className='text-center text-2xl font-bold text-white'>Sakura Spa</span>
      </div>
      <div className='flex flex-col justify-center gap-3 my-10 mx-auto font-bold text-white'>
        <span className="text-center text-xl">Menu</span>
        <div>
          <div>
            <button onClick={()=>setEmployeeOpen(!employeeOpen)} >Employee Management</button>
            {employeeOpen==true &&(
              <ul className="px-4 text-md font-normal flex flex-col">
                <button className='hover:text-lg text-start' onClick={()=>props.onMenuClick('AddEmployee')}>Add Employee</button>
                <button className='hover:text-lg text-start' onClick={()=>props.onMenuClick('EmployeeList')}>Employee List</button>
              </ul>
            )}
            
          </div>
          <div>
            <button onClick={()=>setInventoryOpen(!inventoryOpen)}>Inventory</button>
            {inventoryOpen===true&&(
              <ul className="px-4 text-md font-normal flex flex-col">
              <button className='hover:text-lg text-start' onClick={()=>props.onMenuClick('addInventory')}>Add Inventory</button>
              <button className='hover:text-lg text-start' onClick={()=>props.onMenuClick('inventoryList')}>Inventory List</button>
            </ul>
            )}
          </div>
          <div>
            <button onClick={()=>setFinanceOpen(!financeOpen)}>Finance</button>
            {financeOpen===true&&(
              <ul className="px-4 text-md font-normal">
              <button className='hover:text-lg text-start' onClick={()=>props.onMenuClick('revenueReport')}>Revenue Report</button>
            </ul>
            )}
          </div>
          <div>
            <button className='hover:text-lg text-start' onClick={()=>props.onMenuClick('cashier')}>Cashier</button>
          </div>
          <div>
            <button className='hover:text-lg text-start' onClick={()=>props.onMenuClick('schedule')}>Schedule</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSideMenu;