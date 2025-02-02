import supabase from '../../../utils/supabase';
import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import OrderCard from '../../UI/OrderCard';
import PaymentPage from '../Admin/paymentPage'; // Import your PaymentPage component

const CashierPage = () => {
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null); // State for selected transaction
  const [isPaymentOpen, setIsPaymentOpen] = useState(false); // State to control the modal visibility

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

    // Set up the real-time subscription for INSERT, UPDATE, and DELETE events
    const transactionChannel = supabase
      .channel('transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload: any) => {
          console.log('Real-time update payload:', payload);

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

    // Cleanup subscription on unmount
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
      const updatedTransactions = await api.getTransactions();
      setTransactionsData(updatedTransactions || []);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handlePayment = (transaction: any) => {
    console.log('Process payment for transaction', transaction);
    setSelectedTransaction(transaction); // Set the selected transaction for payment
    setIsPaymentOpen(true); // Open the payment modal
  };

  // Close PaymentPage modal
  const closePaymentModal = () => {
    setIsPaymentOpen(false);
    setSelectedTransaction(null); // Reset the selected transaction
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
          onPayment={() => handlePayment(transaction)} // Pass the specific transaction to handlePayment
          paid={transaction.paid}
          key={transaction.transaction_id}
          id={transaction.transaction_id}
        />
      ))}

      {/* PaymentPage modal */}
      {selectedTransaction && (
        <PaymentPage
          customer_name={selectedTransaction.customer_name}
          service_name={selectedTransaction.service_name}
          service_price={selectedTransaction.amount} // Assuming there's a total field in the transaction
          service_duration={selectedTransaction.duration}
          transaction_id={selectedTransaction.transaction_id}
          open={isPaymentOpen}
          onClose={closePaymentModal} // Close modal function
        />
      )}
    </div>
  );
};

export default CashierPage;
