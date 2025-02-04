import * as React from "react";/
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {api} from '../../../services/api'

const AddServiceForm: React.FC = () => {
  const [keterangan, setKeterangan] = React.useState("");
  const [harga, setHarga] = React.useState(0);
  const [serviceName, setServiceName] = React.useState("");
  const [serviceId, setServiceId] = React.useState("");
  const [serviceData,setServiceData] = React.useState<any[]>([])
  const [serviceType,setServiceType] = React.useState("");

  //service_id
  //service_name
  //service_duration
  //service_price
  //service_type
  //keterangan

  // Check if the entered inventory name matches data
  React.useEffect(()=>{
    const fetchService =async()=>{
      const response = await api.getService();
      setServiceData(response||[]);
    }
    fetchService();
  },[])

  React.useEffect(() => {
    const matchedService = inventoryData.find((item) => item.name === inventoryName);
    if (matchedService) {
      setServiceId(matchedService.inventory_id || "");
      setJumlah(matchedService.amount || 0);
      setSatuan(matchedService.unit || "pcs");
      setKeterangan(matchedService.description || "");
      setHarga(matchedService.price || 0);
    }
  }, [inventoryName]);

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
    console.log("Service Data:", formData);
    const response = await api.addUpdateService(formData);
    if(response.status==200){
      alert('Service added successfully')
    }else{
      console.log(response.message)
      alert('Service add failed, check console log')
    }
    // Add your form submission logic here
  };

  return (
    <div id="addService" className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold underline mb-4">Tambah Service</h1>
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
            options={inventoryData.map((option) => option.name)}
            onInputChange={(event,newValue) => setServiceName(newValue)}
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

export default AddServiceForm;
