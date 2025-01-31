// API service functions
import supabase from '../utils/supabase';
import bcrypt from "bcryptjs";

const saltRounds = parseInt(import.meta.env.SALT_ROUNDS);

async function encryptNewPassword(pass:string){
  const newPassword = await bcrypt.hash(pass, saltRounds);
  return newPassword;
}


export const api = {
  // Auth
  login: async (credentials: { email: string; password: string }) => {
    // Implementation
  },

  // Orders
  getOrders: async () => {
    // Implementation
  },

  // Customers
  getCustomers: async () => {
    let { data, error } = await supabase
      .from('customers')
      .select('*');

    if (error) {
      console.error('Error fetching customers:', error);
      return null;
    }

    return data;
  },

  //getInformation
  //Employee
  getEmployees: async()=> {
    let { data,error } = await supabase.from('employees').select('*');
    if(error){
      console.error('Error fetching Employees data : ', error);
      return null
    }
    return data;
  },

  getTherapist: async()=> {
    let { data,error } = await supabase.from('employees').select('*').eq('role','therapist');
    if(error){
      console.error('Error fetching Employees data : ', error);
      return null
    }
    return data;
  },
  //Inventory
  getInventory: async()=> {
    let { data,error } = await supabase.from('inventory').select('*');
    if(error){
      console.error('Error fetching inventory data : ', error);
      return null
    }
    return data;
  },
  //Transaction
  getTransactions: async () => {
    let { data, error } = await supabase.rpc('get_transaction_details');
  
    if (error) {
      console.error('Error fetching transaction details:', error);
      return null;
    } else {
      console.log('Transaction Data:', data);
      return data; // Return the fetched data
    }
  },

  //services
  getServices: async()=> {
    let { data,error } = await supabase.from('services').select('*');
    if(error){
      console.error('Error fetching inventory data : ', error);
      return null
    }
    return data;
  },

  //insert
  addUpdateEmployee: async (formData: any) => {
    const newPassword = await encryptNewPassword(formData.password)
    console.log(newPassword)
    const { data, error } = await supabase
      .from('employees')
      .upsert(
          { 
            full_name: formData.fullName,
            address: formData.address,
            phone_num: formData.phoneNum,
            age: formData.age,
            id_card_num: formData.KTP,
            salary: formData.salary,
            username: formData.userName,
            password: newPassword,
            role: formData.role
          }
        , 
        { 
          onConflict: 'id_card_num' // This is correct as an array of strings
        }
      )
      .select(); // Fetching the data after upsert
  
    if (error) {
      console.error("Error upserting employee:", error);
      return {status:500,message:error}
    }
    return {data:data,status:200};
  },
  
  
  
};
