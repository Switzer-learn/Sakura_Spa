import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useState } from 'react';

const CashierPage = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 'TRX001',
      customerName: 'John Doe',
      schedule: '2025-01-26 14:00',
      service: 'Full Body Massage',
      duration: '1 Hour',
      therapistName: 'Jane Smith',
    },
    {
      id: 'TRX002',
      customerName: 'Alice Brown',
      schedule: '2025-01-26 15:30',
      service: 'Aromatherapy',
      duration: '90 Minutes',
      therapistName: 'Michael Johnson',
    },
  ]);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSelectTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleEditChange = (field, value) => {
    setSelectedTransaction((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === selectedTransaction.id ? selectedTransaction : t))
    );
    setIsEditDialogOpen(false);
  };

  const handlePayment = (transaction) => {
    alert(`Processing payment for Transaction ID: ${transaction.id}`);
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="border shadow-lg">
          <CardHeader>
            <h3 className="font-bold text-xl">Transaction ID: {transaction.id}</h3>
          </CardHeader>
          <CardContent>
            <p><strong>Customer Name:</strong> {transaction.customerName}</p>
            <p><strong>Schedule:</strong> {transaction.schedule}</p>
            <p><strong>Service:</strong> {transaction.service}</p>
            <p><strong>Duration:</strong> {transaction.duration}</p>
            <p><strong>Therapist Name:</strong> {transaction.therapistName}</p>
            <div className="mt-4 flex justify-between">
              <Button onClick={() => handleSelectTransaction(transaction)} variant="outline">
                Edit
              </Button>
              <Button onClick={() => handlePayment(transaction)} variant="solid">
                Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField
            label="Customer Name"
            fullWidth
            value={selectedTransaction?.customerName || ''}
            onChange={(e) => handleEditChange('customerName', e.target.value)}
          />
          <TextField
            label="Schedule"
            type="datetime-local"
            fullWidth
            value={selectedTransaction?.schedule || ''}
            onChange={(e) => handleEditChange('schedule', e.target.value)}
          />
          <TextField
            label="Service"
            fullWidth
            value={selectedTransaction?.service || ''}
            onChange={(e) => handleEditChange('service', e.target.value)}
          />
          <TextField
            label="Duration"
            fullWidth
            value={selectedTransaction?.duration || ''}
            onChange={(e) => handleEditChange('duration', e.target.value)}
          />
          <TextField
            label="Therapist Name"
            fullWidth
            value={selectedTransaction?.therapistName || ''}
            onChange={(e) => handleEditChange('therapistName', e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="solid">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CashierPage;
