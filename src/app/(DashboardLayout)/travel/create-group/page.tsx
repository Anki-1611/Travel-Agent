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
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebase"; // ✅ auth imported
import { useRouter, useParams, useSearchParams } from "next/navigation";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { onAuthStateChanged } from "firebase/auth";

const CreateGroupForm = () => {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("id"); // ✅ rea
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    places: [] as string[],
    packageAmount: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // ✅ Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/authentication/login"); // redirect if not logged in
      }
    });
    return () => unsubscribe();
  }, [router]);

  // ✅ Fetch existing trip if editing
  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) return;
      try {
        const tripRef = doc(db, "trips", tripId);
        const snap = await getDoc(tripRef);
        if (snap.exists()) {
          const data = snap.data();
          setFormData({
            name: data.name || "",
            startDate: data.startDate || "",
            endDate: data.endDate || "",
            places: data.places || [],
            packageAmount: String(data.packageAmount || ""),
          });
        }
      } catch (err) {
        console.error("Failed to load trip:", err);
        setError("Could not load trip details ❌");
      }
    };
    fetchTrip();
  }, [tripId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to create a trip.");
      return;
    }

    if (
      !formData.name ||
      !formData.startDate ||
      !formData.endDate ||
      formData.places.length === 0 || // ✅ keep manual check
      !formData.packageAmount
    ) {
      setError("All fields are mandatory.");
      return;
    }

    try {
      setLoading(true);
      if (tripId) {
        // Edit mode
        const tripRef = doc(db, "trips", tripId);
        await updateDoc(tripRef, {
          ...formData,
          packageAmount: Number(formData.packageAmount),
          updatedAt: new Date(),
        });
      } else {
        // Create mode
        await addDoc(collection(db, "trips"), {
          ...formData,
          packageAmount: Number(formData.packageAmount),
          createdAt: new Date(),
          userId: user.uid,       // ✅ associate trip with user
          userEmail: user.email,  // optional
        });
      }
      router.push("/");
    } catch (error) {
      console.error("Error saving group:", error);
      setError("Failed to save travel group ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Card
        sx={{
          width: { xs: "100%", sm: "70%", md: "50%" },
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Typography fontWeight="700" variant="h4" mb={3} textAlign="center">
              {tripId ? "Edit Travel Group" : "Create Travel Group"}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                  Trip Name
                </Typography>
                <CustomTextField
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                  Start Date
                </Typography>
                <CustomTextField
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                  End Date
                </Typography>
                <CustomTextField
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                  Places
                </Typography>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={formData.places}
                  onChange={(_, newValue) =>
                    setFormData((prev) => ({ ...prev, places: newValue }))
                  }
                  renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Add places"
                      fullWidth
                    // ❌ remove required here, we are validating manually
                    />
                  )}
                />

              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                  Package Amount
                </Typography>
                <CustomTextField
                  type="number"
                  name="packageAmount"
                  value={formData.packageAmount}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Box>

              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                type="submit"
                disabled={loading}
              >
                {tripId ? "Update Group" : "Create Group"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateGroupForm;
