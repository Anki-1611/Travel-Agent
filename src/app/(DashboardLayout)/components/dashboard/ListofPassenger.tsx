"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
    CardContent,
    Typography,
    Grid,
    Stack,
    Chip,
    Card,
    Button,
    Box,
    CardMedia,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import {
    getAllPassengersForAgency,
    getPassengersForTrip,
    Passenger,
} from "@/app/services/travelService";

const ListOfPassengers = () => {
    const [passengers, setPassengers] = useState<
        (Passenger & { id: string; tripId: string })[]
    >([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPassenger, setSelectedPassenger] = useState<{ tripId: string; passengerId: string; name: string } | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tripId = searchParams.get("tripId");
    const tripName = searchParams.get("tripName"); 
    const dummyImage =
        "https://plus.unsplash.com/premium_photo-1690372791935-3efc879e4ca3?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    const fetchPassengers = async () => {
        try {
            let tripPassengers: Passenger[] = [];
            if (tripId) {
                tripPassengers = await getPassengersForTrip(tripId);
            } else {
                tripPassengers = await getAllPassengersForAgency();
                console.log(tripPassengers,'tripPassengers');
            }
            setPassengers(
                tripPassengers.map((p: any) => ({
                    ...p,
                    tripId: p.tripId || tripId, // optional tripId
                }))
            );
        } catch (err) {
            console.error("Error fetching passengers:", err);
        }
    };

    useEffect(() => {
        fetchPassengers();
    }, [tripId]);

    const handleEdit = (tripId: string, passengerId: string) => {
        router.push(`/travel/create-passenger?tripId=${tripId}&passengerId=${passengerId}`);
    };

    const handleDelete = async (tripId: string, passengerId: string, name: string) => {
        setSelectedPassenger({ tripId, passengerId, name });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedPassenger) {
            // TODO: call deletePassenger(selectedPassenger.tripId, selectedPassenger.passengerId)
            console.log("Delete passenger:", selectedPassenger.passengerId, "from trip:", selectedPassenger.tripId);
            setDeleteDialogOpen(false);
            setSelectedPassenger(null);
            fetchPassengers();
        }
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedPassenger(null);
    };

    const showActions = pathname === "/travel/passenger-list";

    // if (!tripId) {
    //     return (
    //         <Typography variant="body1" color="error">
    //             No trip selected. Please provide a tripId in query params.
    //         </Typography>
    //     );
    // }

    return (
         <Box>
            {/* Heading */}
            <Typography variant="h4" fontWeight={700} mb={3} textAlign="center">
                Passengers from {tripName || "all the trips"}
            </Typography>
        <Grid container spacing={3}>
            {passengers.map((passenger) => (
                <Grid key={passenger.id} item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            boxShadow: 3,
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            transition: "0.3s",
                            "&:hover": { boxShadow: 6, transform: "translateY(-3px)" },
                        }}
                    >
                        {/* Image */}
                        <CardMedia component="img" height="200" image={dummyImage} alt="Trip Image" />

                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                {passenger.name}
                            </Typography>

                            <Typography variant="body2" color="textSecondary">
                                Phone: {passenger.phone}
                            </Typography>

                            <Stack direction="row" spacing={1} mt={2}>
                                <Chip
                                    label={`Total: ₹ ${passenger.totalAmount}`}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                />
                                <Chip
                                    label={`Paid: ₹ ${passenger.advanceAmount}`}
                                    color="success"
                                    variant="outlined"
                                    size="small"
                                />
                            </Stack>
                        </CardContent>

                        {/* Actions pinned at bottom */}
                        {showActions && (
                            <Box p={2} display="flex" gap={1}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<IconEdit size={18} />}
                                    onClick={() => handleEdit(passenger.tripId, passenger.id)}
                                    fullWidth
                                >
                                    Edit
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<IconTrash size={18} />}
                                    onClick={() => handleDelete(passenger.tripId, passenger.id, passenger.name)}
                                    fullWidth
                                >
                                    Delete
                                </Button>
                            </Box>
                        )}
                    </Card>
                </Grid>
            ))}
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
            open={deleteDialogOpen}
            onClose={cancelDelete}
            aria-labelledby="delete-dialog-title"
        >
            <DialogTitle id="delete-dialog-title" color="error">
                Confirm Delete
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete passenger <b>{selectedPassenger?.name}</b>? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelDelete} color="primary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={confirmDelete} color="error" variant="contained">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
        </Box>
    );
};

export default ListOfPassengers;


