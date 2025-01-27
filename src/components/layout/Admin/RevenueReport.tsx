import { LineChart } from '@mui/x-charts/LineChart';
import Transaction from '../../data/TransactionDummyData.json'

export default function RevenueReport(){
    const chartXAxis = Transaction.map((orders)=> {
        return orders.schedule
    })
    console.log(chartXAxis);
    const chartYAxis = Transaction.map((orders)=>{
        //return orders.Amount
    })
    return(
        <div className='container flex flex-col justify-center'>
            <h1 className='text-2xl font-bold underline mt-2'>Revenue Report</h1>
            <div className='grid grid-cols-2'>
            <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                    {
                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                    },

                ]}
                width={500}
                height={300}
            />
                <div></div>
            </div>
        </div>
    )
}