import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {api} from '../../../services/api'

export default function CustomerList() {
  const [loading, setLoading] = useState(true); // Loading state
  const [rows, setRows] = useState<any[]>([]); // Data rows

  // Simulate loading data
  useEffect(() => {
    const fetchCustomer = async () => {
      const customerData: any[] = (await api.getCustomers()) || [];

      // Preprocess rows immediately after fetching
      const processedRows = customerData.data.map((data, index) => ({
        ...data,
        id: data.customer_id || index,
      }));

      setRows(processedRows);
      setLoading(false); // Data is now loaded
    };

    fetchCustomer();
  }, []);
  
  const columns: GridColDef[] = [
    { field: 'customer_id', headerName: 'ID',type:'number'},
    { field: 'customer_name', headerName: 'Nama Lengkap' },
    { field: 'phone_number', headerName: 'Nomor Telepon', type: 'number'},
    { field: 'username', headerName: 'Username'},
    { field: 'member_since', headerName: 'Member Sejak' }
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className=''>
      <h1 className='text-xl font-bold underline text-center my-2'>Customer List</h1>
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
            <img src='/Sakura_Spa_Logo.png' className='animate-pulse size-52 flex my-auto mx-auto' />
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