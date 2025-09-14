"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Alert,
  TextField,
  MenuItem,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import {
  addPassenger,
  getPassengersForTrip,
  Passenger,
} from "@/app/services/travelService";

const CreatePassengerFormByPassenger = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId") || "";
  const tripName = searchParams.get("tripName") || "Trip";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    advanceAmount: "",
    dob: "",
    gender: "",
    passport: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripId) return setError("Trip not specified.");

    const requiredFields = [
      "name",
      "phone",
      "address",
      "advanceAmount",
      "dob",
      "gender",
      "passport",
    ];

    for (let field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Field "${field}" is required.`);
        return;
      }
    }

    try {
      setLoading(true);

      // ✅ Check for duplicate phone number in the same trip
      const existingPassengers: Passenger[] = await getPassengersForTrip(tripId);
      const duplicate = existingPassengers.find(
        (p) => p.phone === formData.phone
      );
      if (duplicate) {
        setError("You are already registered for this trip.");
        return;
      }

      // ✅ Prepare passenger data
      const passengerData: Passenger = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        advanceAmount: Number(formData.advanceAmount),
        paidAmount: Number(formData.advanceAmount),
        dob: formData.dob,
        gender: formData.gender,
        passport: formData.passport,
      };

      await addPassenger(tripId, passengerData);
      alert("Passenger added successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save passenger.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ width: { xs: "100%", sm: "90%", md: "50%" }, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Typography fontWeight="700" variant="h4" mb={3} textAlign="center">
              {tripName}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Stack spacing={3}>
              <CustomTextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth required />
              <CustomTextField name="phone" label="Phone Number" value={formData.phone} onChange={handleChange} fullWidth required />
              <CustomTextField name="address" label="Address" value={formData.address} onChange={handleChange} fullWidth required />
              <CustomTextField name="advanceAmount" label="Advance Amount" type="number" value={formData.advanceAmount} onChange={handleChange} fullWidth required />
              <CustomTextField name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} required />
              <TextField select name="gender" label="Gender" value={formData.gender} onChange={handleChange} fullWidth required>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <CustomTextField name="passport" label="Passport Number" value={formData.passport} onChange={handleChange} fullWidth required />

              <Button color="primary" variant="contained" size="large" fullWidth type="submit" disabled={loading}>
                Submit
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreatePassengerFormByPassenger;
