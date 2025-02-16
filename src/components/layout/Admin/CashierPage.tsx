import supabase from '../../../utils/supabase';
import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import OrderCard from '../../UI/OrderCard';
import PaymentPage from '../Admin/paymentPage';

const CashierPage = () => {
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await api.getTransactions();
        console.log(response)
        setTransactionsData(groupTransactions(response || []));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactionData();

    const transactionChannel = supabase
      .channel('transaction_service')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transaction_service' },
        (payload: any) => {
          setTransactionsData((prevData) => groupTransactions(updateTransactions(prevData, payload)));
        }
      )
      .subscribe();

    return () => {
      transactionChannel.unsubscribe();
    };
  }, []);

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

  const groupTransactions = (transactions: any[]) => {
    const grouped = transactions.reduce((acc, transaction) => {
      const { transaction_id, amount, paid, schedule, payment_method, customer_name, therapist_name, service_name, service_price, service_duration } = transaction;
      
      if (!acc[transaction_id]) {
        acc[transaction_id] = {
          transaction_id,
          amount,
          paid,
          schedule,
          payment_method,
          customer_name,
          therapist_name,
          services: [],
          total_duration: 0,
        };
      }

      acc[transaction_id].services.push({ service_name, service_price, service_duration });
      acc[transaction_id].total_duration += service_duration;
      console.log("acc ", acc);
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const updateTransactions = (prevData: any[], payload: any) => {
    if (payload.eventType === 'INSERT') {
      return [...prevData, payload.new];
    } else if (payload.eventType === 'UPDATE') {
      return prevData.map(transaction => 
        transaction.transaction_id === payload.new.transaction_id 
          ? { ...transaction, ...payload.new } 
          : transaction
      );
    } else if (payload.eventType === 'DELETE') {
      return prevData.filter(transaction => transaction.transaction_id !== payload.old.transaction_id);
    }
    return prevData;
  };

  const handleEdit = async (input: any) => {
    try {
      const response = await api.setTherapist(input);
      if (response.status === 200) {
        console.log(response.message);
      }
      const updatedTransactions = await api.getTransactions();
      setTransactionsData(groupTransactions(updatedTransactions || []));
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-y-auto">
        {filteredTransactions.map(transaction => (
          <OrderCard
            key={transaction.transaction_id}
            customer_name={transaction.customer_name}
            schedule={transaction.schedule}
            services={transaction.services}
            total_duration={transaction.total_duration}
            therapist_name={transaction.therapist_name}
            onEdit={handleEdit}
            onPayment={() => handlePayment(transaction)}
            paid={transaction.paid}
            amount={transaction.amount}
            payment_method={transaction.payment_method}
            transaction_id={transaction.transaction_id}
          />
        ))}
      </div>

      {selectedTransaction && (
        <PaymentPage
          customer_name={selectedTransaction.customer_name}
          services={selectedTransaction.services}
          total_price={selectedTransaction.amount}
          total_duration={selectedTransaction.total_duration}
          transaction_id={selectedTransaction.transaction_id}
          open={isPaymentOpen}
          onClose={closePaymentModal}
        />
      )}
    </div>
  );
};

export default CashierPage;
