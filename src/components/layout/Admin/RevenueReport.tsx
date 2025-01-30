import { useEffect, useState } from "react";
import Transactions from '../../data/TransactionDummyData.json'
import { api } from '../../../services/api'

import { DataGrid, GridColDef} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const RevenueReport = () => {
    const formatPrice = (price:number) => {
        return new Intl.NumberFormat("en-US", {
          style: "decimal",
          maximumFractionDigits: 0,
        }).format(price);
      };
    const [originalData,setOriginalData] = useState<any[]>([])
    const [transactionData,setTransactionData] = useState<any[]>([]);
    const [date,setDate] = useState('');
    const [months,setMonths] = useState('');
    const monthList = ['01','02','03','04','05','06','07','08','09',10,11,12];
    const [years,setYears] = useState<string[]>([]);
    const [yearsSelector,setYearsSelector]=useState('');
    const [grandTotal,setGrandTotal] = useState<number>(0);
    
    const [rows,setRows] = useState<any[]>(
        transactionData.map((data, index) => ({
        ...data,
        id: data.id || index,
        Amount : formatPrice(data.Amount) || 0
        }))
    );

    
    useEffect(()=>{
      const fetchAllTransactions = async() =>{
        const response = await api.getTransactions();
        console.log(response);
        setOriginalData(response || [])
        setTransactionData(response || []);
      }

      fetchAllTransactions();

      const uniqueYears = Array.from(
          new Set(Transactions.map((trans)=>{
              return trans.schedule.slice(0,4)
          }))
      )
      setYears(uniqueYears);
      setYearsSelector((new Date().getFullYear()).toString());
      setMonths(checkMonth((new Date().getMonth()+1).toString()));
    },[])

    useEffect(()=>{
        setRows(transactionData.map((data, index) => ({
            ...data,
            id: data.id || index,
            Amount : formatPrice(data.Amount) || 0,
        })));
        const total= transactionData.reduce((acc:number,transaction: { amount: number })=>acc+transaction.amount,0)
        setGrandTotal(total);
    },[transactionData])

    function handleDateChange(e:any){
        setDate(e.target.value);
        setTransactionData(originalData.filter((data)=>{
            return data.schedule.slice(0,10) === e.target.value;
        }))
    }
    
    function checkMonth(month:any){
        if(month<10){
            month='0'+month;
        }
        return month;
    }

    function handleMonthChange(){
      const selectedYearMonth:string = yearsSelector.toString()+'-'+months;
      setTransactionData(originalData.filter((data)=>{
        return data.schedule.slice(0,7)===selectedYearMonth;
      }))
    }

    const columns: GridColDef[] = [
        { field: 'transaction_id', headerName: 'ID', width: 70 },
        { field: 'customer_name', headerName: 'Nama Customer', width: 200 },
        { field: 'schedule', headerName: 'Schedule', width: 100 },
        { field: 'service', headerName: 'Service', width: 100 },
        { field: 'duration', headerName: 'Durasi', width: 200 },
        { field: 'therapist_name', headerName: 'Nama Therapist', width: 150 },
        { field: 'paid', headerName: 'Sudah Bayar', width: 100 },
        { field: 'amount', headerName: 'Jumlah (IDR)', type:'number', width: 100}
      ];

    const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div className="border-b w-full h-screen bg-white rounded-md overflow-auto">
      <h1 className="text-3xl font-bold flex justify-center">Finance Dashboard Page</h1>
      <div className="text-sm text-gray-800 flex flex-col gap-2 py-3">
        <div className='flex justify-between'>
          <div className='flex flex-col gap-2'>
            <div className="flex gap-2">
              <span className="py-3 px-2"> Choose Date : </span>
              <input className="border-b-2" type="date" onChange={handleDateChange} value={date}/>
              <button className="bg-blue-500 px-3 py-2 text-white rounded-lg" onClick={()=>setTransactionData(originalData)}>Reset</button>
            </div>
            <div className="flex gap-2">
              <span className="py-3 px-2">Monthly : </span>
              <select className="rounded px-2" onChange={(e)=>setMonths(e.target.value)} value={months}>
                {monthList.map((month,index)=>(
                  <option value={month} key={index}>{month}</option>
                ))}
              </select>
              <select className="rounded px-2" onChange={(e)=>setYearsSelector(e.target.value)} value={yearsSelector}>
                {years.map((year)=>(
                  <option value={year} key={year}>{year}</option>
                ))}
              </select>
              <button onClick={handleMonthChange} className="bg-blue-500 px-3 py-2 text-white rounded-lg">
                Select
              </button>
            </div>
          </div>
          <div className='text-xl font-bold'>
            <span>Grand Total : Rp. {formatPrice(grandTotal)},-</span>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default RevenueReport;