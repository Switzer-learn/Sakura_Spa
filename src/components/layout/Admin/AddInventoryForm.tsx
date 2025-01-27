import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Inventory from "../../data/InventoryDummy.json";

const AddInventoryForm: React.FC = () => {
  const [jumlah, setJumlah] = React.useState(0);
  const [satuan, setSatuan] = React.useState("pcs");
  const [keterangan, setKeterangan] = React.useState("");
  const [harga, setHarga] = React.useState(0);
  const [inventoryName, setInventoryName] = React.useState("");
  const [inventoryId, setInventoryId] = React.useState("");

  // Check if the entered inventory name matches data
  React.useEffect(() => {
    const matchedInventory = Inventory.find((item) => item.Name === inventoryName);
    if (matchedInventory) {
      setInventoryId(matchedInventory.ID || "");
      setJumlah(matchedInventory.Amount || 0);
      setSatuan(matchedInventory.Satuan || "pcs");
      setKeterangan(matchedInventory.Keterangan || "");
      setHarga(matchedInventory.Price || 0);
    }
  }, [inventoryName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inventoryData = {
      inventoryId,
      inventoryName,
      jumlah,
      satuan,
      keterangan,
      harga,
    };
    console.log("Inventory Data:", inventoryData);
    // Add your form submission logic here
  };

  return (
    <div id="addInventory" className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold underline mb-4">Tambah Inventory</h1>
      <form
        onSubmit={handleSubmit}
        className="border rounded-lg p-5 shadow-md grid grid-cols-2 gap-4 w-full max-w-4xl bg-white"
      >
        {/* ID Barang */}
        <div className="flex flex-col gap-2">
          <label htmlFor="inventoryID" className="font-medium">
            ID Barang:
          </label>
          <input
            id="inventoryID"
            type='text'
            value={inventoryId}
            disabled
            className='px-3 py-4'
          />
        </div>

        {/* Nama Barang */}
        <div className="flex flex-col gap-2">
          <label htmlFor="inventoryName" className="font-medium">
            Nama Barang:
          </label>
          <Autocomplete
            id="inventoryName"
            freeSolo
            value={inventoryName}
            options={Inventory.map((option) => option.Name)}
            onInputChange={(event,newValue) => setInventoryName(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Nama Barang" required />
            )}
          />
        </div>

        {/* Jumlah */}
        <div className="flex flex-col gap-2">
          <label htmlFor="jumlah" className="font-medium">
            Jumlah:
          </label>
          <TextField
            id="jumlah"
            type="number"
            value={jumlah}
            onChange={(e) => setJumlah(parseInt(e.target.value))}
            label="Jumlah"
            required
          />
        </div>

        {/* Satuan */}
        <div className="flex flex-col gap-2">
          <label htmlFor="satuan" className="font-medium">
            Satuan:
          </label>
          <select
            id="satuan"
            value={satuan}
            onChange={(e) => setSatuan(e.target.value)}
            className="border rounded p-2"
          >
            <option value="pcs">Pcs</option>
            <option value="kg">Kg</option>
            <option value="ml">Ml</option>
          </select>
        </div>

        {/* Harga */}
        <div className="flex flex-col gap-2">
          <label htmlFor="harga" className="font-medium">
            Harga:
          </label>
          <TextField
            id="harga"
            type="number"
            value={harga}
            onChange={(e) => setHarga(parseInt(e.target.value))}
            label="Harga"
            required
          />
        </div>

        {/* Keterangan */}
        <div className="col-span-2 flex flex-col gap-2">
          <label htmlFor="keterangan" className="font-medium">
            Keterangan:
          </label>
          <TextField
            id="keterangan"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            label="Keterangan"
            multiline
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInventoryForm;
