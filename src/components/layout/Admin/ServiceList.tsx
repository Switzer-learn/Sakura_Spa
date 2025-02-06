import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { api } from "../../../services/api";
import supabase from "../../../utils/supabase"; // Import supabase client
import ServiceModal from "./ServiceModal"; // Import the modal

export default function ServiceList() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  useEffect(() => {
    fetchServices();

    // Subscribe to Supabase Realtime
    const subscription = supabase
      .channel("services-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        (payload) => {
          console.log("Change received!", payload);
          handleRealtimeChange(payload);
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Fetch services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const serviceData: any[] = (await api.getServices()) || [];
      setRows(
        serviceData.map((data, index) => ({
          ...data,
          id: data.service_id || index,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
    setLoading(false);
  };

  // Handle Realtime Changes
  const handleRealtimeChange = (payload: any) => {
    const { eventType, new: newData, old: oldData } = payload;

    setRows((prevRows) => {
      if (eventType === "INSERT") {
        return [...prevRows, { ...newData, id: newData.service_id }];
      }
      if (eventType === "UPDATE") {
        return prevRows.map((row) =>
          row.service_id === newData.service_id ? { ...newData, id: newData.service_id } : row
        );
      }
      if (eventType === "DELETE") {
        return prevRows.filter((row) => row.service_id !== oldData.service_id);
      }
      return prevRows;
    });
  };

  // Open the modal for editing
  const handleEdit = (service: any) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  // Open the modal for adding a new service
  const handleAdd = () => {
    setSelectedService(null);
    setModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        console.log(id);
        await api.deleteService(id);
      } catch (error) {
        console.error("Failed to delete service:", error);
      }
    }
  };

  // Handle save (Add/Edit)
  const handleSave = async (serviceData: any) => {
    try {
      if (serviceData.service_id === 0) {
        await api.addService(serviceData);
      } else {
        await api.updateService(serviceData);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "service_id", headerName: "ID", width: 70 },
    { field: "service_name", headerName: "Nama Service", width: 200 },
    { field: "service_duration", headerName: "Durasi", type: "number", width: 200 },
    { field: "service_price", headerName: "Harga", type: "number", width: 100 },
    { field: "service_type", headerName: "Tipe", width: 100 },
    { field: "keterangan", headerName: "Keterangan", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <div className="space-x-2">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div>
      <h1 className="text-xl font-bold underline text-center my-2">
        Service List
      </h1>

      {/* Add Service Button */}
      <Button
        variant="contained"
        color="success"
        onClick={handleAdd}
        sx={{ marginBottom: 2 }}
      >
        Add New Service
      </Button>

      <Paper
        sx={{
          height: 500,
          width: "100%",
          padding: 2,
          boxShadow: 3,
          position: "relative",
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          },
        }}
      >
        {loading ? (
          <div className="flex justify-center align-middle h-screen">
            <img
              src="./Sakura_Spa_Logo.png"
              className="animate-pulse size-52 flex my-auto mx-auto"
            />
          </div>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-root": {
                backgroundColor: "transparent",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f4f4f4",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-cell": {
                fontSize: "0.875rem",
              },
            }}
          />
        )}
      </Paper>

      {/* Service Modal */}
      <ServiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={selectedService}
      />
    </div>
  );
}
