import EmployeeListData from '../../data/EmployeeDummyData.json'
import { DataGrid, GridColDef} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';


export default function EmployeeList()
{
    const columns: GridColDef[] = [
        { field: 'ID', headerName: 'ID', width: 70 },
        { field: 'fullName', headerName: 'Nama Lengkap', width: 200 },
        { field: 'phoneNum', headerName: 'Nomor Telepon', type: 'number', width: 100 },
        { field: 'Age', headerName: 'Umur', width: 100 },
        { field: 'IDCardNum', headerName: 'No KTP', width: 200 },
        { field: 'Salary', headerName: 'Gaji (IDR)', type:'number', width: 150 },
        { field: 'Username', headerName: 'Username', width: 100 },
        { field: 'Role', headerName: 'Jabatan', width: 100}
      ];
    
      // Preprocess rows to ensure unique `id`
      const rows = EmployeeListData.map((data, index) => ({
        ...data,
        id: data.ID || index,
        Salary : numberWithCommas(data.Salary) || 0
      }));
    
      const paginationModel = { page: 0, pageSize: 10 };
    
      function numberWithCommas(x:number) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

    return(
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
    )
}