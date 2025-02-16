/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from '../../../utils/supabase';
import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import OrderCard from '../../UI/OrderCard';
import PaymentPage from '../Admin/paymentPage';

interface Service {
  service_name: string;
  service_price: number;
  service_duration: number;
}

interface Transaction {
  transaction_id: string;
  amount: number;
  paid: boolean;
  schedule: string;
  payment_method: string;
  customer_name: string;
  therapist_name: string;
  service_name: string;
  service_price: number;
  service_duration: number;
  services?: Service[]; // New field to store services
  total_duration?: number; // New field for total service duration
}


const CashierPage = () => {
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await api.getTransactions();
        if (response) {
          setTransactionsData(groupTransactions(response as Transaction[]));
        }
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
        (payload: unknown) => {
          setTransactionsData(prevData => groupTransactions(updateTransactions(prevData, payload as { eventType: string; new?: Transaction; old?: Transaction })));
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

  const groupTransactions = (transactions: Transaction[]): Transaction[] => {
    const grouped: Record<string, Transaction & { services: Service[]; total_duration: number }> = {};
  
    transactions.forEach(transaction => {
      const {
        transaction_id,
        amount,
        paid,
        schedule,
        payment_method,
        customer_name,
        therapist_name,
        service_name,
        service_price,
        service_duration,
      } = transaction;
  
      if (!grouped[transaction_id]) {
        grouped[transaction_id] = {
          transaction_id,
          amount,
          paid,
          schedule,
          payment_method,
          customer_name,
          therapist_name,
          service_name,
          service_price,
          service_duration,
          services: [],
          total_duration: 0,
        };
      }
  
      grouped[transaction_id].services.push({ service_name, service_price, service_duration });
      grouped[transaction_id].total_duration += service_duration;
    });
  
    return Object.values(grouped);
  };
  

  const updateTransactions = (prevData: Transaction[], payload: { eventType: string; new?: any; old?: any }): Transaction[] => {
    if (payload.eventType === 'INSERT' && payload.new) {
      return [...prevData, payload.new as Transaction];
    } else if (payload.eventType === 'UPDATE' && payload.new) {
      return prevData.map(transaction =>
        transaction.transaction_id === payload.new.transaction_id
          ? { ...transaction, ...payload.new }
          : transaction
      );
    } else if (payload.eventType === 'DELETE' && payload.old) {
      return prevData.filter(transaction => transaction.transaction_id !== payload.old.transaction_id);
    }
    return prevData;
  };
  

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Handles edit transaction request.
 * @param {Object} input - The input data in the format of { transaction_id: string, therapist_name: string }
 * @returns {Promise<void>}
 */
/******  603f99b3-685a-4834-8b35-9355cd236887  *******/
  const handleEdit = async (input: { transaction_id: string; therapist_name: string }) => {
    try {
      const response = await api.setTherapist(input);
      if (response.status === 200) {
        console.log(response.message);
      }
      const updatedTransactions = await api.getTransactions();
      setTransactionsData(groupTransactions(updatedTransactions as Transaction[]));
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };
  

  const handlePayment = (transaction: Transaction) => {
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
            services={transaction.services || []}
            therapist_name={transaction.therapist_name}
            onEdit={() => handleEdit(transaction)}
            onPayment={() => handlePayment(transaction)}
            paid={transaction.paid}
            total_duration={transaction.total_duration || 0}
            amount={transaction.amount}
            payment_method={transaction.payment_method}
            transaction_id={transaction.transaction_id}
          />
        ))}
      </div>

        {selectedTransaction && (
          <PaymentPage
            customer_name={selectedTransaction.customer_name}
            services={selectedTransaction.services || []}
            total_price={selectedTransaction.amount}
            total_duration={selectedTransaction.total_duration || 0}
            transaction_id={selectedTransaction.transaction_id}
            open={isPaymentOpen}
            onClose={closePaymentModal}
          />
        )}
        
    </div>
  );
};

export default CashierPage;
