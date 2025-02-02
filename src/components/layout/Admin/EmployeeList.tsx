import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {api} from '../../../services/api'

export default function EmployeeList() {
  const [loading, setLoading] = useState(true); // Loading state
  const [rows, setRows] = useState<any[]>([]); // Data rows

  // Simulate loading data
  useEffect(() => {
    const fetchEmployees = async () => {
      const employeesData: any[] = (await api.getEmployees()) || [];
      // Preprocess rows immediately after fetching
      const processedRows = employeesData.map((data, index) => ({
        ...data,
        id: data.employee_id || index,
      }));
      
      setRows(processedRows.sort());
      setLoading(false); // Data is now loaded
    };

    fetchEmployees();
  }, []);

  const columns: GridColDef[] = [
    { field: 'employee_id', headerName: 'ID', width: 70 },
    { field: 'full_name', headerName: 'Nama Lengkap', width: 200 },
    { field: 'address', headerName: 'Alamat', width: 200 },
    { field: 'phone_num', headerName: 'Nomor Telepon', type: 'number', width: 100 },
    { field: 'age', headerName: 'Umur', width: 100 },
    { field: 'id_card_num', headerName: 'No KTP', width: 100 },
    { field: 'salary', headerName: 'Gaji (IDR)', type: 'number', width: 100 },
    { field: 'username', headerName: 'Username', width: 100 },
    { field: 'role', headerName: 'Jabatan', width: 100 }
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className=''>
      <h1 className='text-xl font-bold underline text-center my-2'>Employee List</h1>
      <Paper
        sx={{
          height: 500,
          width: '100%',
          padding: 2,
          boxShadow: 3,
          position: 'relative', // For background image positioning
          //backgroundImage: 'url(./Sakura_Spa_Logo.png)', // Add background image
          backgroundSize: 'cover', // Ensure the image covers the entire Paper
          backgroundPosition: 'center', // Center the background image
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // Adjust opacity here (30% opacity for the image)
          },
        }}
      >
        {loading ? (
          <div
            className='flex justify-center align-middle h-screen'
          >
            <img src='./Sakura_Spa_Logo.png' className='animate-pulse size-52 flex my-auto mx-auto' />
          </div>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-root': {
                backgroundColor: 'transparent', // Make table background transparent
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f4f4f4',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell': {
                fontSize: '0.875rem',
              },
            }}
          />
        )}
      </Paper>
    </div>
  );
}