import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { api } from "../../../services/api";
import supabase from "../../../utils/supabase";

export default function InventoryList() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    fetchInventory();

    // Subscribe to inventory changes in Supabase
    const subscription = supabase
      .channel("inventory-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory" },
        (payload) => {
          handleRealtimeChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const inventoryData: any[] = (await api.getInventory()) || [];
      setRows(
        inventoryData.map((data, index) => ({
          ...data,
          id: data.inventory_id || index
        }))
      );
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
    setLoading(false);
  };

  const handleRealtimeChange = (payload: any) => {
    const { eventType, new: newData, old: oldData } = payload;
    setRows((prevRows) => {
      if (eventType === "INSERT") {
        return [...prevRows, { ...newData, id: newData.inventory_id }];
      }
      if (eventType === "UPDATE") {
        return prevRows.map((row) =>
          row.inventory_id === newData.inventory_id
            ? { ...newData, id: newData.inventory_id }
            : row
        );
      }
      if (eventType === "DELETE") {
        return prevRows.filter((row) => row.inventory_id !== oldData.inventory_id);
      }
      return prevRows;
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await api.deleteInventory(id);
      } catch (error) {
        console.error("Failed to delete inventory item:", error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "inventory_id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nama Barang", width: 200 },
    { field: "amount", headerName: "Jumlah", type: "number", width: 100 },
    { field: "unit", headerName: "Satuan", width: 100 },
    { field: "description", headerName: "Keterangan", width: 200 },
    { field: "price", headerName: "Harga (IDR)",type:'number', width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <div className="space-x-2">
          <Button variant="contained" color="error" size="small" onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div>
      <h1 className="text-xl font-bold underline text-center my-2">Inventory List</h1>

      <Paper sx={{ height: 500, width: "100%", padding: 2, boxShadow: 3 }}>
        {loading ? (
          <div className="flex justify-center align-middle h-screen">
            <img src="/Sakura_Spa_Logo.png" className="animate-pulse size-52 flex my-auto mx-auto" />
          </div>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
          />
        )}
      </Paper>
     </div>
  );
}
