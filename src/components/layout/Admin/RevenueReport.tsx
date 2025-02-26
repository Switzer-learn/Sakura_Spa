import { useEffect, useState } from "react";
import Transactions from '../../data/TransactionDummyData.json';
import { api } from '../../../services/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const RevenueReport = () => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "decimal",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const [originalData, setOriginalData] = useState<any[]>([]);
    const [transactionData, setTransactionData] = useState<any[]>([]);
    const [date, setDate] = useState('');
    const [months, setMonths] = useState('');
    const monthList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12];
    const [years, setYears] = useState<string[]>([]);
    const [yearsSelector, setYearsSelector] = useState('');
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

    const [rows, setRows] = useState<any[]>([]);
    const paidStatus = (input:boolean) =>{
        if(input===true){
            return 'Sudah bayar'
        }else{
            return "Belum bayar"
        }
    }
    useEffect(() => {
        const fetchAllTransactions = async () => {
            setIsLoading(true); // Start loading
            try {
                const response = await api.getTransactions();
                setOriginalData(response || []);
                //console.log(response)
                setTransactionData(response || []);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setIsLoading(false); // Stop loading
            }
        };

        fetchAllTransactions();

        const uniqueYears = Array.from(new Set(Transactions.map((trans) => trans.schedule.slice(0, 4))));
        setYears(uniqueYears);
        setYearsSelector((new Date().getFullYear()).toString());
        setMonths(checkMonth((new Date().getMonth() + 1).toString()));
    }, []);

    useEffect(() => {
        // Group transactions by transaction_id
        const groupedTransactions = transactionData.reduce((acc: any, transaction: any) => {
            const existingTransaction = acc.find((t: any) => t.transaction_id === transaction.transaction_id);
            
            if (existingTransaction) {
                // Append service details
                existingTransaction.service_name += `, ${transaction.service_name}`;
                existingTransaction.service_duration += transaction.service_duration; // Sum the durations
            } else {
                // Create a new entry
                acc.push({
                    ...transaction,
                    id: transaction.transaction_id, // Ensure unique ID
                    service_name: transaction.service_name,
                    duration: transaction.service_duration, // Initialize duration as a number
                    amount: formatPrice(transaction.amount),
                    paid: paidStatus(transaction.paid),
                });
            }
            
            return acc;
        }, []);
    
        // Format duration with " min" suffix
        groupedTransactions.forEach((transaction: any) => {
            transaction.duration = `${transaction.duration} min`;
        });
    
        setRows(groupedTransactions);
    
        // Calculate Grand Total
        const total = groupedTransactions.reduce((acc: number, transaction: { amount: string }) => 
            acc + parseInt(transaction.amount.replace(/,/g, ''), 10), 0
        );
        setGrandTotal(total);
    }, [transactionData]);

    function handleDateChange(e: any) {
        setDate(e.target.value);
        setTransactionData(originalData.filter((data) => data.schedule.slice(0, 10) === e.target.value));
    }

    function checkMonth(month: any) {
        return month < 10 ? '0' + month : month;
    }

    function handleMonthChange() {
        const selectedYearMonth: string = yearsSelector + '-' + months;
        setTransactionData(originalData.filter((data) => data.schedule.slice(0, 7) === selectedYearMonth));
    }

    const columns: GridColDef[] = [
        { field: 'transaction_id', headerName: 'ID', width: 100 },
        { field: 'customer_name', headerName: 'Nama Customer', width: 200 },
        { field: 'schedule', headerName: 'Schedule', width: 150 },
        { field: 'service_name', headerName: 'Services', width: 250 }, // Now showing multiple services
        { field: 'service_duration', headerName: 'Durasi', width: 150 }, // Display multiple durations
        { field: 'therapist_name', headerName: 'Nama Therapist', width: 200 },
        { field: 'paid', headerName: 'Sudah Bayar', width: 120 },
        { field: 'amount', headerName: 'Jumlah (IDR)', type: 'number', width: 150 },
        { field: 'payment_method', headerName: 'Payment Method', width: 150 },
    ];
    

    const paginationModel = { page: 0, pageSize: 10 };

    return (
        <div className="border-b w-full h-screen bg-white rounded-md overflow-auto">
            <h1 className="text-3xl font-bold flex justify-center">Finance Dashboard Page</h1>

            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <img src='/Sakura_Spa_Logo.png' className='animate-pulse size-52 flex my-auto mx-auto' />
                </div>
            ) : (
                <div>
                    <div className="text-sm text-gray-800 flex flex-col gap-2 py-3">
                        <div className='flex justify-between'>
                            <div className='flex flex-col gap-2'>
                                <div className="flex gap-2">
                                    <span className="py-3 px-2"> Choose Date : </span>
                                    <input className="border-b-2" type="date" onChange={handleDateChange} value={date} disabled={isLoading} />
                                    <button className="bg-blue-500 px-3 py-2 text-white rounded-lg" onClick={() => setTransactionData(originalData)} disabled={isLoading}>
                                        Reset
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <span className="py-3 px-2">Monthly : </span>
                                    <select className="rounded px-2" onChange={(e) => setMonths(e.target.value)} value={months} disabled={isLoading}>
                                        {monthList.map((month, index) => (
                                            <option value={month} key={index}>{month}</option>
                                        ))}
                                    </select>
                                    <select className="rounded px-2" onChange={(e) => setYearsSelector(e.target.value)} value={yearsSelector} disabled={isLoading}>
                                        {years.map((year) => (
                                            <option value={year} key={year}>{year}</option>
                                        ))}
                                    </select>
                                    <button onClick={handleMonthChange} className="bg-blue-500 px-3 py-2 text-white rounded-lg" disabled={isLoading}>
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
            )}
        </div>
    );
};

export default RevenueReport;
