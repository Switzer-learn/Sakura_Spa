import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const AddInventoryForm: React.FC = () => {
  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Dark Knight', year: 2008 },
    // Add more items as needed
  ];

  const [jumlah, setJumlah] = React.useState('');
  const [satuan, setSatuan] = React.useState('pcs');
  const [keterangan, setKeterangan] = React.useState('');
  const [harga, setHarga] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inventoryData = {
      jumlah,
      satuan,
      keterangan,
      harga,
    };
    console.log('Inventory Data:', inventoryData);
    // Add your form submission logic here
  };

  return (
    <div id='addInventory' className='flex flex-col items-center'>
      <h1 className='text-xl font-bold underline'>Tambah Inventory</h1>
      <form
        onSubmit={handleSubmit}
        className='border rounded-lg p-5 shadow-md flex flex-col gap-4 w-full max-w-md'
      >
        <div className='flex flex-col gap-2'>
          <label htmlFor='inventoryID'>ID Barang:</label>
          <Autocomplete
            id='inventoryID'
            freeSolo
            options={top100Films.map((option) => option.title)}
            renderInput={(params) => <TextField {...params} label='ID Barang' required />}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='inventoryName'>Nama Barang:</label>
          <Autocomplete
            id='inventoryName'
            freeSolo
            options={top100Films.map((option) => option.title)}
            renderInput={(params) => <TextField {...params} label='Nama Barang' required />}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='jumlah'>Jumlah:</label>
          <TextField
            id='jumlah'
            type='number'
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            label='Jumlah'
            required
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='satuan'>Satuan:</label>
          <select
            id='satuan'
            value={satuan}
            onChange={(e) => setSatuan(e.target.value)}
            className='border rounded p-2'
          >
            <option value='pcs'>Pcs</option>
            <option value='kg'>Kg</option>
            <option value='ml'>Ml</option>
          </select>
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='keterangan'>Keterangan:</label>
          <TextField
            id='keterangan'
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            label='Keterangan'
            multiline
            rows={3}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='harga'>Harga:</label>
          <TextField
            id='harga'
            type='number'
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            label='Harga'
            required
          />
        </div>

        <button
          type='submit'
          className='rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2'
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddInventoryForm;
