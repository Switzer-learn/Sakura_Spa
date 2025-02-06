import supabase from '../../../utils/supabase';
import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import OrderCard from '../../UI/OrderCard';
import PaymentPage from '../Admin/paymentPage';

const CashierPage = () => {
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]); // Filtered transactions
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]); // Default to today

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await api.getTransactions();
        setTransactionsData(response || []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactionData();

    const transactionChannel = supabase
      .channel('transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload: any) => {
          //console.log('Real-time update payload:', payload);

          setTransactionsData((prevData) => {
            if (payload.eventType === 'INSERT') {
              return [...prevData, payload.new];
            } else if (payload.eventType === 'UPDATE') {
              return prevData.map((transaction) =>
                transaction.transaction_id === payload.new.transaction_id
                  ? { ...transaction, ...payload.new }
                  : transaction
              );
            } else if (payload.eventType === 'DELETE') {
              return prevData.filter(
                (transaction) => transaction.transaction_id !== payload.old.transaction_id
              );
            }
            return prevData;
          });
        }
      )
      .subscribe();

    return () => {
      transactionChannel.unsubscribe();
    };
  }, []);

  // Filter transactions based on selected date
  useEffect(() => {
    if (selectedDate) {
      const filtered = transactionsData.filter(transaction => 
        transaction.schedule.startsWith(selectedDate)
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactionsData);
    }
  }, [transactionsData, selectedDate]);

  const handleEdit = async (input: any) => {
    try {
      const response = await api.setTherapist(input);
      if(response.status===200){
        console.log(response.message)
      }
      const updatedTransactions = await api.getTransactions();
      setTransactionsData(updatedTransactions || []);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handlePayment = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsPaymentOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="p-4">
      {/* Date Filter */}
      <div className="mb-4">
        <label htmlFor="dateFilter" className="font-semibold">Filter by Date: </label>
        <input
          type="date"
          id="dateFilter"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-3 py-1 rounded-md"
        />
      </div>

      {/* Transaction List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-y-auto">
        {filteredTransactions.map((transaction) => (
          <OrderCard
            customerName={transaction.customer_name}
            schedule={transaction.schedule}
            service={transaction.service_name}
            duration={transaction.duration}
            therapistName={transaction.therapist_name}
            onEdit={handleEdit}
            onPayment={() => handlePayment(transaction)}
            paid={transaction.paid}
            amount={transaction.amount}
            paymentMethod={transaction.payment_method}
            key={transaction.transaction_id}
            id={transaction.transaction_id}
          />
        ))}
      </div>

      {/* PaymentPage modal */}
      {selectedTransaction && (
        <PaymentPage
          customer_name={selectedTransaction.customer_name}
          service_name={selectedTransaction.service_name}
          service_price={selectedTransaction.amount}
          service_duration={selectedTransaction.duration}
          transaction_id={selectedTransaction.transaction_id}
          open={isPaymentOpen}
          onClose={closePaymentModal}
        />
      )}
    </div>
  );
};

export default CashierPage;
