import { useEffect } from 'react';
import OrderCard from '../../UI/OrderCard';
import TransactionData from '../../data/TransactionDummyData.json'

const CashierPage = () => {
  const CashierData = TransactionData.filter((transaction)=>{
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
        customerName={transaction.customerName}
        schedule={transaction.schedule}
        service={transaction.service}
        duration={transaction.duration}
        therapistName={transaction.therapistName}
        onSelect={handleSelect}
        onEdit={handleEdit}
        onPayment={handlePayment}
        />
      ))}
    </div>
  );
};

export default CashierPage;
