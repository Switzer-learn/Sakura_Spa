import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { api } from "../../../services/api";

const AddInventoryForm: React.FC = () => {
  const [jumlah, setJumlah] = React.useState<number | null>(0);
  const [satuan, setSatuan] = React.useState<string>("pcs");
  const [keterangan, setKeterangan] = React.useState<string>("");
  const [harga, setHarga] = React.useState<number | null>(0);
  const [inventoryName, setInventoryName] = React.useState<string>("");
  const [inventoryId, setInventoryId] = React.useState<string>("");
  const [inventoryData, setInventoryData] = React.useState<any[]>([]);

  // Fetch inventory data once on mount
  React.useEffect(() => {
    const fetchInventory = async () => {
      const response = await api.getInventory();
      setInventoryData(response || []);
    };
    fetchInventory();
  }, []);

  // Update fields when inventoryName changes
  React.useEffect(() => {
    const matchedInventory = inventoryData.find((item) => item.name === inventoryName);
    if (matchedInventory) {
      setInventoryId(matchedInventory.inventory_id || "");
      setJumlah(matchedInventory.amount || 0);
      setSatuan(matchedInventory.unit || "pcs");
      setKeterangan(matchedInventory.description || "");
      setHarga(matchedInventory.price || 0);
    } else if (inventoryName === "") {
      resetForm();
    }
  }, [inventoryName]);

  // Reset form fields
  const resetForm = () => {
    setInventoryId("");
    setInventoryName("");
    setJumlah(0);
    setSatuan("pcs");
    setKeterangan("");
    setHarga(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      inventoryId,
      inventoryName,
      jumlah,
      satuan,
      keterangan,
      harga,
    };
    console.log("Inventory Data:", formData);
    const response = await api.addUpdateInventory(formData);
    if (response.status === 200) {
      alert("Inventory added successfully");
      resetForm(); // Reset form after successful submission
    } else {
      console.log(response.message);
      alert("Inventory add failed, check console log");
    }
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
            ID Barang: <span className='text-sm text-gray-500'>jika ingin memasukan data baru pastikan id barang 0</span>
          </label>
          <input
            id="inventoryID"
            type="text"
            value={inventoryId}
            disabled
            className="px-3 py-4 border rounded"
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
            options={inventoryData.map((option) => option.name)}
            onInputChange={(event, newValue) => setInventoryName(newValue)}
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
            value={jumlah ?? ""}
            onChange={(e) => setJumlah(e.target.value ? parseInt(e.target.value) : null)}
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
            value={harga ?? ""}
            onChange={(e) => setHarga(e.target.value ? parseInt(e.target.value) : null)}
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

        {/* Buttons */}
        <div className="col-span-2 flex justify-between">
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg bg-gray-500 hover:bg-gray-600 text-white px-6 py-2"
          >
            Reset
          </button>
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
