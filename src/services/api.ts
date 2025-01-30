// API service functions
import supabase from '../utils/supabase';

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
  
  
};
