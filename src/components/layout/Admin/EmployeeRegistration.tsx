import React, { useState } from "react";
import * as Component from "../../../components";

const EmployeeRegistration: React.FC = () => {
  const [role, setRole] = useState("Therapist");
  const [newRole, setNewRole] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phoneNum: "",
    age: "",
    KTP: "",
    salary: "",
    userName: "",
    password: "",
  });

  // Update form data dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted", { ...formData, role: role === "Lainnya" ? newRole : role });
  };

  // Role selector change handler
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
    if (e.target.value !== "Lainnya") setNewRole("");
  };

  return (
    <div id="EmployeeRegister" className="flex flex-col">
      <h1 className="text-2xl font-bold text-center underline">Register Employee</h1>
      <form onSubmit={handleSubmit} className="m-auto w-full max-w-2xl p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Personal Data Section */}
          <div className="border rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-center">Data Diri</h2>
            <Component.TextInput
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap"
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            <Component.TextInput
              label="Alamat"
              placeholder="Masukkan alamat"
              type="text"
              id="address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <Component.TextInput
              label="No HP"
              placeholder="+62"
              type="text"
              id="phoneNum"
              value={formData.phoneNum}
              onChange={handleInputChange}
            />
            <Component.TextInput
              label="Usia"
              placeholder="Masukkan usia"
              type="number"
              id="age"
              value={formData.age}
              onChange={handleInputChange}
            />
            <Component.TextInput
              label="No KTP"
              placeholder="Masukkan Nomor KTP"
              type="text"
              id="KTP"
              pattern="[0-9]{16}"
              value={formData.KTP}
              onChange={handleInputChange}
            />
            <Component.TextInput
              label="Gaji"
              placeholder="Rp."
              type="number"
              id="salary"
              value={formData.salary}
              onChange={handleInputChange}
            />
          </div>

          {/* Login Section */}
          <div className="border rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-center">Username & Password</h2>
            <Component.TextInput
              label="Username"
              placeholder="Masukkan Username"
              type="text"
              id="userName"
              value={formData.userName}
              onChange={handleInputChange}
            />
            <Component.TextInput
              label="Password"
              placeholder="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <label htmlFor="roleSelector" className="block mt-3">
              Role
            </label>
            <select
              id="roleSelector"
              className="border rounded w-full p-2 mt-1"
              value={role}
              onChange={handleRoleChange}
            >
              <option value="Admin">Admin</option>
              <option value="Therapist">Therapist</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {role === "Lainnya" && (
              <div className="mt-3">
                <label className="font-semibold">Jabatan Baru:</label>
                <input
                  type="text"
                  className="border rounded w-full p-2 mt-1"
                  placeholder="Masukkan jabatan baru"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                />
              </div>
            )}
            <p className="mt-3 font-semibold">Role: {role === "Lainnya" ? newRole : role}</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2 mt-6 block mx-auto"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EmployeeRegistration;
