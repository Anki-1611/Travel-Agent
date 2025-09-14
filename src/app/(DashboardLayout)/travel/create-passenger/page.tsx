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
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import {
  addPassenger,
  getPassengerById,
  updatePassenger,
  Passenger,
  getTripsForAgency,
  Trip,
} from "@/app/services/travelService";

const CreatePassengerForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripIdParam = searchParams.get("tripId");
  const passengerId = searchParams.get("passengerId"); // 👈 use id from URL for edit

  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    tripId: tripIdParam || "",
    name: "",
    phone: "",
    address: "",
    totalAmount: "",
    advanceAmount: "",
    dob: "",
    gender: "",
    passport: "",
  });

  const isEditMode = Boolean(passengerId);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchTrips(currentUser.uid);

        if (isEditMode && tripIdParam && passengerId) {
          fetchPassenger(tripIdParam, passengerId);
        }
      } else router.push("/authentication/login");
    });
    return () => unsubscribe();
  }, [router, isEditMode, tripIdParam, passengerId]);

  // Fetch trips
  const fetchTrips = async (userId: string) => {
    try {
      const tripsData = await getTripsForAgency();
      setTrips(tripsData);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
      setError("Could not load trips ❌");
    }
  };

  // Fetch passenger if editing
  const fetchPassenger = async (tripId: string, passengerId: string) => {
    try {
      const passenger = await getPassengerById(tripId, passengerId);
      if (passenger) {
        setFormData({
          tripId,
          name: passenger.name,
          phone: passenger.phone,
          address: passenger.address,
          totalAmount: String(passenger.totalAmount),
          advanceAmount: String(passenger.advanceAmount),
          dob: passenger.dob,
          gender: passenger.gender,
          passport: passenger.passport,
        });
      }
    } catch (err) {
      console.error("Failed to fetch passenger:", err);
      setError("Could not load passenger ❌");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setError("You must be logged in.");
    if (!formData.tripId) return setError("Please select a trip.");

    const requiredFields = [
      "name",
      "phone",
      "address",
      "totalAmount",
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
      const passengerData: Passenger = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        totalAmount: Number(formData.totalAmount),
        advanceAmount: Number(formData.advanceAmount),
        paidAmount: Number(formData.advanceAmount),
        remainingAmount: Number(formData.totalAmount) - Number(formData.advanceAmount),
        dob: formData.dob,
        gender: formData.gender,
        passport: formData.passport,
      };

      if (isEditMode && passengerId) {
        await updatePassenger(formData.tripId, passengerId, passengerData);
      } else {
        await addPassenger(formData.tripId, passengerData);
      }

      router.push("/travel/list");
    } catch (err) {
      console.error("Error saving passenger:", err);
      setError("Failed to save passenger ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ width: { xs: "100%", sm: "70%", md: "50%" }, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Typography fontWeight="700" variant="h4" mb={3} textAlign="center">
              {isEditMode ? "Edit Passenger" : "Add Passenger"}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Stack spacing={3}>
              {/* Trip select dropdown */}
              <TextField
                select
                name="tripId"
                label="Select Trip"
                value={formData.tripId}
                onChange={handleChange}
                fullWidth
                required
                disabled={isEditMode} // cannot change trip in edit mode
              >
                {trips.map((trip) => (
                  <MenuItem key={trip.id} value={trip.id}>
                    {trip.name} ({trip.startDate} → {trip.endDate})
                  </MenuItem>
                ))}
              </TextField>

              <CustomTextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth required />
              <CustomTextField name="phone" label="Phone Number" value={formData.phone} onChange={handleChange} fullWidth required />
              <CustomTextField name="address" label="Address" value={formData.address} onChange={handleChange} fullWidth required />
              <CustomTextField name="totalAmount" label="Total Amount Received" type="number" value={formData.totalAmount} onChange={handleChange} fullWidth required />
              <CustomTextField name="advanceAmount" label="Advance Amount" type="number" value={formData.advanceAmount} onChange={handleChange} fullWidth required />
              <CustomTextField name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} required />
              <TextField select name="gender" label="Gender" value={formData.gender} onChange={handleChange} fullWidth required>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <CustomTextField name="passport" label="Passport Number" value={formData.passport} onChange={handleChange} fullWidth required />

              <Button color="primary" variant="contained" size="large" fullWidth type="submit" disabled={loading}>
                {isEditMode ? "Update Passenger" : "Add Passenger"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreatePassengerForm;
