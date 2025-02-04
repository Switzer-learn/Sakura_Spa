// API service functions
import supabase from '../utils/supabase';
import bcrypt from "bcryptjs";

const saltRounds = parseInt(import.meta.env.SALT_ROUNDS);

async function encryptNewPassword(pass:string){
  const newPassword = await bcrypt.hash(pass, saltRounds);
  return newPassword;
}

async function fetchUsername(dbName:string,username:string){
  let {data} = await supabase.from(dbName)
    .select('*')
    .eq('username',username)
    .single();

    return data
}

function todayDate(){
  const date = new Date()
  const month = ()=>{
    let result:any = date.getMonth()+1
    if(result>10) result='0'+result;
    return result;
  }
  const today = date.getFullYear() + '-' + month() +'-'+ date.getDate();
  console.log('today',today);
  return today;
}

function generateTransactionId(){
  const date = new Date();
  const month = date.getMonth()+1;
  const randNum = Math.floor(Math.random()*1000)
  let trxId = 'ORD-'+date.getFullYear()+month+date.getDate()+randNum;
  return trxId;
}

export const api = {
  // Auth
  
  customerRegister: async (credentials:any) => {
  const { email, password, fullName,phoneNumber } = credentials;
  
  // Sign up user with Supabase Auth
  const { data, error } = await supabase.auth.signUp(
    { email, password,
      options: {
      emailRedirectTo: 'https://sakuraspa-mrly--5173--d20a0a75.local-credentialless.webcontainer.io/',
      }, 
    },
    );
  if (error) {
    console.error("Registration error:", error);
    console.log(error);
    return { status: 400, message: error.message };
  }
  console.log(data);
  // Insert into `customers` table, linking to auth user ID
  if(data.user){
    const { error: customerError } = await supabase.from("customers").insert({
      auth_user_id: data.user.id, // **Stores the auth user ID**
      customer_name: fullName,
      email:email,
      phone_number:phoneNumber,
      member_since: todayDate(),
    });

    if (customerError) {
      console.error("Error saving customer data:", customerError);
      return { status: customerError.code, message: "Failed to create customer profile" };
    }
  }
  return { status: 200, message: "Registration successful", user: data.user };
},

// **LOGIN using Supabase Auth**
login: async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("Login error:", error);
    return { status: 400, message: error.message };
  }
  return { status: 200, message: "Login successful", user: data.user };
},

// **LOGOUT**
logout: async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error);
    return { status: 500, message: error.message };
  }
  return { status: 200, message: "Logged out successfully" };
},

// **GET CURRENT LOGGED-IN USER**
getCurrentUser: async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  return data.user; // **Returns logged-in user's ID**
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

  getSpecificCustomer:async(id:string)=>{
    let {data,error} = await supabase
      .from('customers')
      .select('*')
      .eq('auth_user_id',id)
      .single();

      if(error){
        return {status:500, message:error}
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
    let { data,error } = await supabase.from('employees').select('*').eq('role','Therapist');
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

  //insert & update
  //Employee
  addUpdateEmployee: async (formData: any) => {
    const newPassword = await encryptNewPassword(formData.password)
    const { data, error } = await supabase
      .from('employees')
      .upsert(
          { 
            full_name: formData.fullName,
            address: formData.address,
            phone_number: formData.phoneNum,
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
  //Inventory
  addUpdateInventory: async (formData: any) => {
    const { data, error } = await supabase
      .from('inventory')
      .upsert(
          { 
            name: formData.inventoryName,
            amount: formData.jumlah,
            unit: formData.satuan,
            description: formData.keterangan,
            price: formData.harga,
          }, 
        { 
          onConflict: 'name' // This is correct as an array of strings
        }
      )
      .select(); // Fetching the data after upsert
  
    if (error) {
      console.error("Error upserting Inventory:", error);
      return {status:500,message:error}
    }
    return {data:data,status:200};
  },
  //customer registration
  addCustomer: async(formData:any)=>{
    const newPassword = await encryptNewPassword(formData.password);
    const { data, error } = await supabase
      .from('customers')
      .insert(
          { 
            customer_name: formData.name,
            username: formData.username,
            password: newPassword,
            phone_number: formData.phoneNumber,
          }
      )
      .select(); // Fetching the data after insert
    if (error) {
      console.error("Error registering Customer:", error);
      return {status:error.code,message:error}
    }
    return {data:data,status:200};
  },

  //Order / transactions
  addOrders : async(formData:any) =>{
    //console.log(formData);
    const {customer_id,therapist_id,paid,date,time,service} = formData;
      const { data, error } = await supabase
        .from('transactions')
        .insert(
            { 
              transaction_id : generateTransactionId(),
              customer_id : customer_id,
              schedule : date+' '+time,
              service_id : service.service_id ,
              duration : service.service_duration,
              therapist_id : therapist_id,
              paid : paid,
              amount : service.service_price
            }
        )
        .select(); // Fetching the data after insert
      if (error) {
        console.error("Error registering Customer:", error);
        return {status:error.code,message:error}
      }
      return {data:data,status:200};
  },

  setTherapist:async(input:any)=>{
    const {therapist_id,transaction_id} = input;
    let {data,error} = await supabase
      .from('transactions')
      .update({
        therapist_id:therapist_id
      })
      .eq('transaction_id',transaction_id);
    
      if(error){
        console.log('Error updating therapist ',error)
        return {status:500,message:error}
      }
      return {status:200,message:'Therapist assigned'}
  },

  processPayment:async(input:any)=>{
    console.log(input);
    const {transaction_id,paid,payment_method} = input;
    const {data,error} = await supabase
      .from('transactions')
      .update({
        paid :paid,
        payment_method : payment_method
      })
      .eq('transaction_id',transaction_id);
      if(error){
        return {status:500,message:error}
      }
    return {status:200, message:data}
  },

  deleteService:async(input:any)=>{
    console.log(input);
  }
};
