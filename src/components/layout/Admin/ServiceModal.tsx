import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (serviceData: ServiceFormData) => void;
  initialData?: ServiceFormData; // Pass data when editing
}

interface ServiceFormData {
  service_id: number;
  service_name: string;
  service_duration: number;
  service_price: number;
  description: string;
  service_type: string;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    service_id: 0,
    service_name: "",
    service_duration: 0,
    service_price: 0,
    description: "",
    service_type: "",
  });

  // Update form when editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        service_id: 0,
        service_name: "",
        service_duration: 0,
        service_price: 0,
        description: "",
        service_type: "",
      });
    }
  }, [initialData]);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Save Click
  const handleSave = () => {
    if (confirm("Are you sure you want to save this service?")) {
      onSave(formData);
    }
  };

  // Handle Cancel Click
  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? Changes will not be saved.")) {
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={handleCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {initialData ? "Edit Service" : "Add New Service"}
        </Typography>

        {/* Service ID (Disabled) */}
        <TextField
          label="Service ID"
          name="service_id"
          value={formData.service_id}
          fullWidth
          margin="normal"
          disabled
        />

        {/* Service Name */}
        <TextField
          label="Service Name"
          name="service_name"
          value={formData.service_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Service Duration */}
        <TextField
          label="Service Duration (Minutes)"
          name="service_duration"
          type="number"
          value={formData.service_duration}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Service Price */}
        <TextField
          label="Service Price"
          name="service_price"
          type="number"
          value={formData.service_price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Service Type */}
        <TextField
          label="Service Type"
          name="service_type"
          value={formData.service_type}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Description */}
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />

        {/* Buttons */}
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="contained" color="error" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ServiceModal;
