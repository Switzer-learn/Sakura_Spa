import supabase from '../../../utils/supabase';
import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import OrderCard from '../../UI/OrderCard';

const CashierPage = () => {
  const [transactionsData, setTransactionsData] = useState<any[]>([]);

  // Initial data fetch and real-time subscription
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await api.getTransactions();
        console.log("Fetched transactions:", response);
        setTransactionsData(response || []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactionData();

    // Real-time subscription to listen for changes in transactions
    const transactionChannel = supabase
      .channel('transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload: any) => {
        console.log('Transaction updated:', payload);

        setTransactionsData((prevData) => {
          const updated = prevData.map((transaction) =>
            transaction.transaction_id === payload.new.transaction_id
              ? { ...transaction, ...payload.new }
              : transaction
          );
          console.log('Updated state:', updated);
          return updated;
        });
      })
      .subscribe();

    // Cleanup the subscription when the component unmounts
    return () => {
      transactionChannel.unsubscribe();
    };
  }, []);

  const handleSelect = () => {
    console.log('Transaction selected');
  };

  const handleEdit = async (input: any) => {
    console.log('Edit transaction with input:', input);
    try {
      const response = await api.setTherapist(input);
      console.log('Therapist updated:', response);
      // Optionally re-fetch transactions if you prefer that over real-time updates:
       const updatedTransactions = await api.getTransactions();
       setTransactionsData(updatedTransactions || []);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handlePayment = () => {
    console.log('Process payment');
  };

  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-y-auto">
      {transactionsData.map((transaction) => (
        <OrderCard
          customerName={transaction.customer_name}
          schedule={transaction.schedule}
          service={transaction.service_name}
          duration={transaction.duration}
          therapistName={transaction.therapist_name}
          onSelect={handleSelect}
          onEdit={handleEdit}
          onPayment={handlePayment}
          paid={transaction.paid}
          key={transaction.transaction_id}
          id={transaction.transaction_id}
        />
      ))}
    </div>
  );
};

export default CashierPage;
