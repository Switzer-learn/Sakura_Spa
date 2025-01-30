import OrderCard from '../../UI/OrderCard';
import { api } from '../../../services/api'
import {useState,useEffect} from 'react';

const CashierPage = () => {
  const [transactionsData,setTransactionsData] = useState<any[]>([]);

  useEffect(()=>{
    const fetchTransactionData = async () => {
      try {
        const response = await api.getTransactions();
        if (!response || typeof response !== 'object') {
          throw new Error("Invalid response format");
        }
        console.log(response);
        setTransactionsData(response || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactionData();
  },[])

  const CashierData = transactionsData.filter((transaction)=>{
    return transaction.paid===false;
  })
  
  const handleSelect = () => {
    console.log('Transaction selected');
  };
  
  const handleEdit = () => {
    console.log('Edit transaction');
  };
  
  const handlePayment = () => {
    console.log('Process payment');
  };

  
  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-y-auto">
      {CashierData.map((transaction)=>(
        <OrderCard
        customerName={transaction.customer_name}
        schedule={transaction.schedule}
        service={transaction.service}
        duration={transaction.duration}
        therapistName={transaction.therapist_name}
        onSelect={handleSelect}
        onEdit={handleEdit}
        onPayment={handlePayment}
        key={transaction.transaction_id}
        />
      ))}
    </div>
  );
};

export default CashierPage;
