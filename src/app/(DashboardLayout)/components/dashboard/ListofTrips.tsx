"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  CardContent,
  Typography,
  Grid,
  Stack,
  Chip,
  Card,
  CardMedia,
  Button,
  Box,
} from "@mui/material";
import { IconEdit, IconTrash, IconUserPlus } from "@tabler/icons-react";
import { getTripsForAgency, Trip, getPassengersForTrip, deleteTrip } from "@/app/services/travelService";
import SharePassengerLink from "./SharePassengerLink";
import ShareWhatsAppButton from "./ShareWhatsAppButton";

const dummyImage =
  "https://plus.unsplash.com/premium_photo-1690372791935-3efc879e4ca3?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const ListofTrips = () => {
  const [trips, setTrips] = useState<(Trip & { passengers: any[]; id: string })[]>([]);
  const pathname = usePathname();
  const router = useRouter(); // ✅ initialize router

  const fetchTrips = async () => {
    const allTrips = await getTripsForAgency();
    const tripsWithPassengers = await Promise.all(
      allTrips.map(async (trip: any) => {
        const passengers = await getPassengersForTrip(trip.id);
        return { ...trip, passengers };
      })
    );
    setTrips(tripsWithPassengers);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (tripId: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      await deleteTrip(tripId);
      fetchTrips();
    }
  };

  const handleEdit = (tripId: string) => {
    if (!tripId) return;
    // Navigate using query param "id"
    router.push(`/travel/create-group?id=${tripId}`);
  };

  const handleAddPassenger = (tripId: string) => {
    console.log("Add passenger to trip:", tripId);
    router.push(`/travel/create-passenger?id=${tripId}`);
    // Example: open modal or navigate to add passenger page
  };

  const handleViewPassenger = (tripId: string,tripName:string) => {
    router.push(`/travel/passenger-list?tripId=${tripId}&tripName=${tripName}`);
  };

  const handleShare = (tripId: string, tripName: string) => {
    router.push(`/passenger/create-passanger?tripId=${tripId}&tripName=${tripName}`);
  };

  const showActions = pathname === "/travel/list";

  return (
    <Grid container spacing={3}>
      {trips.map((trip) => (
        <Grid key={trip.id} item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              transition: "0.3s",
              "&:hover": { boxShadow: 6, transform: "translateY(-3px)" },
            }}
          >
            {/* Dummy Image */}
            <CardMedia component="img" height="200" image={dummyImage} alt="Trip Image" />

            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {trip.name}
              </Typography>

              <Typography variant="body2" color="textSecondary" gutterBottom>
                {trip.startDate} → {trip.endDate}
              </Typography>

              <Stack direction="row" spacing={1} mt={2}>
                <Chip label={`Package: $${trip.packageAmount}`} color="primary" variant="outlined" size="small" />
                <Chip label={`Passengers: ${trip.passengers.length}`} color="secondary" variant="outlined" size="small" />
              </Stack>

              {/* Action Buttons */}
              {showActions && (
                <Box mt={2} display="flex" flexDirection="column" gap={1}>
                  <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<IconEdit size={18} />}
                      onClick={() => handleEdit(trip.id)}
                      fullWidth
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<IconTrash size={18} />}
                      onClick={() => handleDelete(trip.id)}
                      fullWidth
                    >
                      Delete
                    </Button>
                  </Stack>

                  {/* Add Passenger Button */}
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<IconUserPlus size={18} />}
                    onClick={() => handleAddPassenger(trip.id)}
                    fullWidth
                  >
                    Add Passenger
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<IconUserPlus size={18} />}
                    onClick={() => handleViewPassenger(trip.id,trip.name)}
                    fullWidth
                  >
                    View Passenger
                  </Button>
                  <SharePassengerLink tripId={trip.id} tripName={trip.name} />
                   <ShareWhatsAppButton tripId={trip.id} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ListofTrips;
