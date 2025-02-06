import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { api } from "../../../services/api";

export default function EmployeeList() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const employeesData: any[] = (await api.getEmployees()) || [];
      const processedRows = employeesData.map((data, index) => ({
        ...data,
        id: data.employee_id || index,
      }));
      setRows(processedRows);
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  const handleEditClick = (employee: any) => {
    setSelectedEmployee(employee);
    setOpenEditModal(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const response = await api.deleteEmployee(id);
      if(response.status===200){
        setRows((prev) => prev.filter((row) => row.employee_id !== id));
        alert('Employee successfully deleted');
      }else{
        alert("Delete fail");
        console.log(response)
      }
      
    }
  };

  const handleEditSubmit = async () => {
    if (selectedEmployee) {
      const response=await api.updateEmployee(selectedEmployee.employee_id, selectedEmployee);
      if(response.status===200){
        alert('Employee Data successfully updated');
        setRows((prev) =>
        prev.map((row) =>
          row.employee_id === selectedEmployee.employee_id ? selectedEmployee : row
        )
      );
      }else{
        alert('Update fail');
        console.log(response)
      }
      
    }
    setOpenEditModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEmployee({ ...selectedEmployee, [e.target.name]: e.target.value });
  };

  const columns: GridColDef[] = [
    { field: "employee_id", headerName: "ID", width: 70 },
    { field: "full_name", headerName: "Nama Lengkap", width: 200 },
    { field: "address", headerName: "Alamat", width: 200 },
    { field: "phone_number", headerName: "Nomor Telepon", width: 100 },
    { field: "age", headerName: "Umur", width: 100 },
    { field: "id_card_num", headerName: "No KTP", width: 100 },
    { field: "salary", headerName: "Gaji (IDR)", type:'number', width: 100 },
    { field: "username", headerName: "Username", width: 100 },
    { field: "role", headerName: "Jabatan", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEditClick(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteClick(params.row.employee_id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold underline text-center my-2">
        Employee List
      </h1>
      <Paper sx={{ height: 500, width: "100%", padding: 2, boxShadow: 3 }}>
        {loading ? (
          <div className="flex justify-center align-middle h-screen">
            <img
              src="/Sakura_Spa_Logo.png"
              className="animate-pulse size-52 flex my-auto mx-auto"
            />
          </div>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
          />
        )}
      </Paper>

      {/* Edit Employee Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <>
              <TextField
                label="Nama Lengkap"
                name="full_name"
                value={selectedEmployee.full_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Alamat"
                name="address"
                value={selectedEmployee.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Nomor Telepon"
                name="phone_num"
                value={selectedEmployee.phone_number}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Gaji"
                name="salary"
                type="number"
                value={selectedEmployee.salary}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Jabatan"
                name="role"
                value={selectedEmployee.role}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
