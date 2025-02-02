import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { api } from '../../../services/api';

export default function InventoryList() {
  const [loading, setLoading] = useState(true); // ✅ Fix: Added proper useState syntax
  const [rows, setRows] = useState<any[]>([]);

  const formatPrice = (price:number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const columns: GridColDef[] = [
    { field: 'inventory_id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nama Barang', width: 200 },
    { field: 'amount', headerName: 'Jumlah', type: 'number', width: 100 },
    { field: 'unit', headerName: 'Satuan', width: 100 },
    { field: 'description', headerName: 'Keterangan', width: 200 },
    { field: 'price', headerName: 'Harga (IDR)', width: 150 },
  ];

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const inventoryData: any[] = (await api.getInventory()) || [];

        // Preprocess rows immediately after fetching
        const processedRows = inventoryData.map((data, index) => ({
          ...data,
          id: data.inventory_id || index,
          price: formatPrice(data.price) || 0,
        }));
        console.log(inventoryData)
        setRows(processedRows.sort());
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false); // ✅ Ensure loading state is updated after fetching
      }
    };

    fetchInventory();
  }, []);

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className=''>
      <h1 className='text-xl font-bold underline text-center my-2'>Inventory List</h1>
      <Paper sx={{ height: 500, width: '100%', padding: 2, boxShadow: 3 }}>
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
                backgroundColor: '#fff',
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
