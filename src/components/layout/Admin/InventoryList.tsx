import { DataGrid, GridColDef} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

// Import the inventory data
import Inventory from '../../data/InventoryDummy.json';

export default function InventoryList() {
  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    { field: 'ID', headerName: 'ID', width: 70 },
    { field: 'Name', headerName: 'Nama Barang', width: 200 },
    { field: 'Amount', headerName: 'Jumlah', type: 'number', width: 100 },
    { field: 'Satuan', headerName: 'Satuan', width: 100 },
    { field: 'Keterangan', headerName: 'Keterangan', width: 200 },
    {
      field: 'Price', // Matches the JSON key exactly
      headerName: 'Harga (IDR)',
      width: 150,
    },
  ];

  // Preprocess rows to ensure unique `id`
  const rows = Inventory.map((item, index) => ({
    ...item,
    id: item.ID || index, // Use 'ID' field or fallback to index
    Price : numberWithCommas(item.Price)
  }));

  const paginationModel = { page: 0, pageSize: 10 };

  function numberWithCommas(x:number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

  return (
    <Paper sx={{ height: 500, width: '100%', padding: 2, boxShadow: 3 }}>
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
    </Paper>
  );
}
