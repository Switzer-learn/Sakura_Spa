/* eslint-disable @typescript-eslint/no-explicit-any */
// API service functions
import supabase from '../utils/supabase';

function todayDate(){
  const date = new Date()
  const month = ()=>{
    let result:any = date.getMonth()+1
    if(result>10) result='0'+result;
    return result;
  }
  const today = date.getFullYear() + '-' + month() +'-'+ date.getDate();
  return today;
}

function generateUserId(){
  const date = new Date();
  const month = date.getMonth()+1;
  const randNum = Math.floor(Math.random()*1000)
  const userId = 'WALKIN-'+date.getFullYear()+month+date.getDate()+randNum;
  return userId;
}

function generateTransactionId(){
  const date = new Date();
  const month = date.getMonth()+1;
  const randNum = Math.floor(Math.random()*1000)
  const trxId = 'ORD-'+date.getFullYear()+month+date.getDate()+randNum;
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
    return { status: 400, message: error.message };
  }
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

forgotPassword:async(email:string)=>{
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://sakuraspabwi.com/reset-password", // Customize this
  });

  if (error) {
    return {status:500,message:error}
  }
  return {status:200,message:'Password email sent'}
},

updatePassword:async(newPassword:string)=>{
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {message:error,status:500};
  } else {
    return {status:200,message:'Password resetted'}
  }
},

 addWalkInCustomer:async(inputData:any)=>{
  const {customer_name,phone_number,email} = inputData;
  
  const {data,error} = await supabase
    .from('customers')
    .insert({
      auth_user_id:generateUserId(),
      customer_name:customer_name,
      phone_number:phone_number,
      email:email
    })
    .select();

    if(error){
      return {status:500,message:error}
    }
    return {status:200,message:'walkIn customer insert successfull',data:data}
 },

// **LOGIN using Supabase Auth**
login: async ({ email, password }: { email: string; password: string }) => { 
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

checkAdminRole: async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('role')
      .eq('auth_user_id', id);

    if (error) {
      return { status: 500, message: error };
    }

    if (data && data.length > 0) {
      const role = data[0].role; // Extract role from the first object

      if (role === "Owner") {
        return { status: 200, message: 'User is an Admin' };
      } else {
        return { status: 400, message: 'User is not Admin' };
      }
    }

    return { status: 404, message: 'User not found' };
  } catch (err) {
    console.error(err);
    return { status: 500, message: 'Unexpected error' };
  }
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
    const { data, error } = await supabase
      .from('customers')
      .select('*');

    if (error) {
      console.error('Error fetching customers:', error);
      return null;
    }
    return {status:200,data:data};
  },

  //customer
  getSpecificCustomer:async(id:string)=>{
    const {data,error} = await supabase
      .from('customers')
      .select('*')
      .eq('auth_user_id',id)
      .single();

      if(error){
        return {status:500, message:error}
      }
      return {status:200,data:data};
  },

  //getInformation
  //Employee
  getEmployees: async()=> {
    const { data,error } = await supabase.from('employees').select('*');
    if(error){
      console.error('Error fetching Employees data : ', error);
      return null
    }
    return data;
  },

  getTherapist: async()=> {
    const { data,error } = await supabase.from('employees').select('*').eq('role','Therapist');
    if(error){
      console.error('Error fetching Employees data : ', error);
      return null
    }
    return data;
  },

  updateEmployee: async (employee_id:any,input:any)=>{
    const {full_name,address,phone_number,age,id_card_num,salary,username,role} = input;
    const { error } = await supabase
      .from('employees')
      .update({
        full_name,
        address,
        phone_number,
        age,
        id_card_num,
        salary,
        username,
        role
      })
      .eq('employee_id',employee_id);
      if(error){
        return {status:500,message:error}
      }
      return {status:200,message:'Employee updated successfully'}
  },

  deleteEmployee:async(input:any)=>{
    const {error} = await supabase
      .from('employees')
      .delete()
      .eq('employee_id',input)

    if(error){
      return {status:500,message:error}
    }
    return{status:200,message:'Employee deleted'}
  },

  EmployeeLogin: async (email: string, password: string) => {
    // Sign in employee using Supabase Auth with email & password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      console.error("Error during employee login:", authError);
      return { status: 400, message: authError.message };
    }

    // Retrieve the employee record from the "employees" table using the auth user ID
    const userId = authData.user.id;
    const { data: employeeData, error: employeeError } = await supabase
      .from("employees")
      .select("*")
      .eq("auth_user_id", userId)
      .single();

    if (employeeError) {
      console.error("Error fetching employee data:", employeeError);
      return { status: 400, message: employeeError.message };
    }

    // Return employee details (you can also store details locally if needed)
    return { status: 200, message: "Login successful", employee: employeeData };
  },

  EmployeeAdminRegistration: async (input: any) => {
    const { email, full_name, address, age, id_card_num, salary, password, phone_number } = input;

    // Sign up the employee using Supabase Auth with email & password
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      // Optionally include email redirect options here
    });

    if (authError) {
      console.error("Error during employee sign up:", authError);
      return { status: 400, message: authError.message };
    }

    // Insert additional employee details into the "employees" table
    if (authData.user) {
      const { error: insertError } = await supabase.from("employees").insert({
        auth_user_id: authData.user.id,  // Link employee record to the auth user ID
        full_name:full_name,
        address:address,
        age:age,
        id_card_num:id_card_num,
        salary:salary,
        phone_number:phone_number
      });

      if (insertError) {
        console.error("Error inserting employee data:", insertError);
        return { status: 400, message: insertError.message };
      }
      return { status: 200, message: "Employee registration successful", user: authData.user };
    }
    return { status: 400, message: "Employee registration failed" };
  },
  //Inventory
  getInventory: async()=> {
    const { data,error } = await supabase.from('inventory').select('*');
    if(error){
      console.error('Error fetching inventory data : ', error);
      return null
    }
    return data;
  },
  //Transaction
  getTransactions: async () => {
    const { data, error } = await supabase.rpc('get_transaction_services');
    if (error) {
      console.error('Error fetching transaction details:', error);
      return null;
    } else {
      return data; // Return the fetched data
    }
  },

  //services
  getServices: async()=> {
    const { data,error } = await supabase.from('services').select('*');
    if(error){
      console.error('Error fetching inventory data : ', error);
      return null
    }
    return data;
  },

  //insert & update
  //Employee
  addUpdateEmployee: async (formData: any) => {
    const { data, error } = await supabase
      .from('employees')
      .upsert(
          { 
            full_name: formData.full_name,
            address: formData.address,
            phone_number: formData.phone_number,
            age: formData.age,
            id_card_num: formData.id_card_num,
            salary: formData.salary,
            username: formData.email,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteInventory:async(input:any)=>{
    const {error} = await supabase
      .from('inventory')
      .delete()
      .eq('inventory_id',input);

    if(error){
      return {status:500,message:error}
    }
    return {status:200,message:'Selected Inventory deleted'}
  },

  //Order / transactions
  addOrders : async(formData:any) =>{
    const {customer_id,therapist_id,paid,date,time,amount} = formData;
      const { data, error } = await supabase
        .from('transactions')
        .insert(
            { 
              transaction_id : generateTransactionId(),
              customer_id : customer_id,
              schedule : date+' '+time,
              therapist_id : therapist_id,
              paid : paid,
              amount : amount
            }
        )
        .select(); // Fetching the data after insert
      if (error) {
        console.error("Error registering Customer:", error);
        return {status:error.code,message:error}
      }
      return {data:data,status:200};
  },

  addTransactionService: async (inputData: { transaction_id: number; service_id: number }) => {
    const { transaction_id, service_id } = inputData;
    const { data, error } = await supabase
      .from("transaction_service")
      .insert([{ transaction_id, service_id }]) // Fix: Use an array for bulk insert
      .select(); // Fetch inserted data
  
    if (error) {
      console.error("Error inserting transaction service:", error);
      return { status: 400, message: error };
    }
  
    return { data, status: 200 };
  },
  

  addService:async(input:any)=>{
    const {service_name,service_duration,service_price,service_type,description} = input;
    const {error} = await supabase
      .from('services')
      .insert({
        service_name:service_name,
        service_duration:service_duration,
        service_price:service_price,
        service_type:service_type,
        keterangan:description
      })
  if(error){
    return {status:500,message:error}
  }
  return {status:200,message:'New service insert success'}
  },

  updateService:async(input:any)=>{
    const {service_id,service_name,service_duration,service_price,service_type,description} = input;
    const {error} = await supabase
      .from('services')
      .update({
        service_id:service_id,
        service_name:service_name,
        service_duration:service_duration,
        service_price:service_price,
        service_type:service_type,
        description:description
      })
      .eq('service_id',service_id)
    
    if(error){
      return {status:500,message:error}
    }
  return {status:200,message:'Service update success'}
  },

  deleteService:async(input:any)=>{
    const {error} = await supabase
      .from('services')
      .delete()
      .eq('service_id',input)
      if(error){
        return {status:500,message:error}
      }
      return {status:200,message:'deleted successfully'}
  },

  setTherapist:async(input:{transaction_id:string,therapist_id:number})=>{
    const {therapist_id,transaction_id} = input;
    
    const {error} = await supabase
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
  }
};
