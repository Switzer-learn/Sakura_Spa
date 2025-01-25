import React, { useState } from "react";

const EmployeeListCard: React.FC = () => {
  const [user, setUser] = useState({
    fullName: "Nama Lengkap",
    phone: "No HP",
    age: "Umur",
    username: "Username",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Handle Edit Button Click
  const handleEdit = () => {
    setIsEditing(true); // Enable edit mode
  };

  // Handle Save Button Click
  const handleSave = () => {
    setIsEditing(false); // Disable edit mode
  };

  // Handle Delete Button Click
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUser({ fullName: "", phone: "", age: "", username: "" }); // Clear user data
    }
  };

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  return (
    <div className="w-96 flex flex-col items-center gap-2 border rounded-lg px-4 py-4 shadow-md">
      {isEditing ? (
        <>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            className="border-b-2 w-full px-2 py-1"
          />
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="border-b-2 w-full px-2 py-1"
          />
          <input
            type="text"
            name="age"
            value={user.age}
            onChange={handleChange}
            className="border-b-2 w-full px-2 py-1"
          />
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="border-b-2 w-full px-2 py-1"
          />
        </>
      ) : (
        <>
          <span className="text-xl font-bold">{user.fullName}</span>
          <span>{user.phone}</span>
          <span>{user.age}</span>
          <span>{user.username}</span>
        </>
      )}

      <div className="flex gap-2 mt-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="rounded-s-full bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="rounded-s-full bg-green-500 hover:bg-green-600 w-24 px-3 py-2 text-white"
          >
            Edit
          </button>
        )}
        <button
          onClick={handleDelete}
          className="rounded-e-full bg-red-500 hover:bg-red-600 w-24 px-3 py-2 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EmployeeListCard;