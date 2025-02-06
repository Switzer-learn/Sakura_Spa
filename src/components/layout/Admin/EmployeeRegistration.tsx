import React, { useState } from "react";
import * as Component from "../../../components";
import { api } from "../../../services/api"; // Use your existing API

interface EmployeeRegistrationProps {
  adminLogin?: boolean; // Determines whether admin or regular employee is being registered
}

const EmployeeRegistration: React.FC<EmployeeRegistrationProps> = ({ adminLogin = false }) => {
  const [role, setRole] = useState("Therapist");
  const [newRole, setNewRole] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    phone_number: "",
    age: "",
    id_card_num: "",
    salary: "",
    email: "",
    password: "",
  });

  // Update form data dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      role: role === "Lainnya" ? newRole : role, // If "Lainnya", use custom role
    };

    try {
      let response;
      if (adminLogin) {
        // Register Admin with Supabase Auth
        response = await api.EmployeeAdminRegistration(updatedFormData);
      } else {
        // Register Regular Employee (No Auth)
        response = await api.addUpdateEmployee(updatedFormData);
      }

      console.log("Form Submitted:", updatedFormData);

      if (response.status === 200) {
        alert("New Employee successfully registered");
      } else {
        alert('Register Failed')
        console.log(response.message);
      }
    } catch (error: any) {
      console.error("Registration Error:", error.message);
      alert("Failed to register employee. Check console for details.");
    }
  };

  return (
    <div id="EmployeeRegister" className="flex flex-col">
      <h1 className="text-2xl font-bold text-center underline">Register Employee</h1>
      <form onSubmit={handleSubmit} className="m-auto w-full max-w-2xl p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Personal Data Section */}
          <div className="border rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-center">Data Diri</h2>
            <Component.TextInput label="Nama Lengkap" id="full_name" type="text" value={formData.full_name} onChange={handleInputChange} />
            <Component.TextInput label="Alamat" id="address" type="text" value={formData.address} onChange={handleInputChange} />
            <Component.TextInput label="No HP" id="phone_number" type="text" value={formData.phone_number} onChange={handleInputChange} />
            <Component.TextInput label="Usia" id="age" type="number" value={formData.age} onChange={handleInputChange} />
            <Component.TextInput label="No KTP" id="id_card_num" type="text" pattern="[0-9]{16}" value={formData.id_card_num} onChange={handleInputChange} />
            <Component.TextInput label="Gaji" id="salary" type="number" value={formData.salary} onChange={handleInputChange} />
          </div>

          {/* Login Section (Only for Admins) */}
          <div className="border rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-center">Email & Password {adminLogin ? "(Admin Only)" : "(Optional)"}</h2>
            <Component.TextInput label="Email" id="email" type="email" value={formData.email} onChange={handleInputChange} />
            {adminLogin && (
              <Component.TextInput label="Password" id="password" type="password" value={formData.password} onChange={handleInputChange} />
            )}

            <label htmlFor="roleSelector" className="block mt-3">Role</label>
            <select id="roleSelector" className="border rounded w-full p-2 mt-1" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Admin">Admin</option>
              <option value="Therapist">Therapist</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            {role === "Lainnya" && (
              <div className="mt-3">
                <label className="font-semibold">Jabatan Baru:</label>
                <input type="text" className="border rounded w-full p-2 mt-1" placeholder="Masukkan jabatan baru" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
              </div>
            )}
            <p className="mt-3 font-semibold">Role: {role === "Lainnya" ? newRole : role}</p>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2 mt-6 block mx-auto">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EmployeeRegistration;
