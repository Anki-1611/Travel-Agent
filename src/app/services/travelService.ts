import { auth, db } from "@/firebase/firebase"; // ✅ firebase config
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  query,
  where,
  addDoc,
} from "firebase/firestore";

// -------------------------
// Trip interface
// -------------------------
export interface Trip {
  name: string;
  startDate: string;
  endDate: string;
  id?:string;
  places: string[]; // ✅ array
  packageAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
  agencyId?: string; // ✅ link trip to travel agency
}

// -------------------------
// Passenger interface
// -------------------------
export interface Passenger {
  name: string;
  phone: string;
  address: string;
  totalAmount?: number;
  advanceAmount?: number;
  dob: string;
  gender: string;
  passport: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;

  // Optional fields
  paidAmount?: number;
  remainingAmount?: number;
}

// -------------------------
// Create a new trip (associated with logged-in travel agency)
// -------------------------
export const createTrip = async (trip: Trip) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const tripRef = doc(collection(db, "trips"));
  await setDoc(tripRef, {
    ...trip,
    agencyId: user.uid, // ✅ associate with agency
    createdAt: new Date(),
  });
  return tripRef.id;
};

// -------------------------
// Update an existing trip
// -------------------------
export const updateTrip = async (
  tripId: string,
  updatedData: Partial<Trip>
) => {
  const tripRef = doc(db, "trips", tripId);
  await updateDoc(tripRef, {
    ...updatedData,
    updatedAt: new Date(),
  });
};


// -------------------------
// Update passenger payment
// -------------------------
export const updatePassengerPayment = async (
  tripId: string,
  passengerId: string,
  amountPaidNow: number
) => {
  const passengerRef = doc(db, "trips", tripId, "passengers", passengerId);
  const passengerSnap = await getDoc(passengerRef);
  if (!passengerSnap.exists()) throw new Error("Passenger not found");

  const data = passengerSnap.data() as Passenger;
  const newPaidAmount = (data.paidAmount || 0) + amountPaidNow;
  const newRemaining = (data.totalAmount || 0) - newPaidAmount;

  await updateDoc(passengerRef, {
    paidAmount: newPaidAmount,
    remainingAmount: newRemaining,
  });
};

// -------------------------
// Fetch all trips for logged-in agency
// -------------------------
// -------------------------
// Fetch all trips for logged-in agency (based on agencyId)
// -------------------------
export const getTripsForAgency = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");
  // Query trips where agencyId === logged-in user's UID
  const tripsCol = collection(db, "trips");
  const q = query(tripsCol, where("userId", "==", user.uid));
  const tripsSnap = await getDocs(q);

  const trips = tripsSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Trip),
  }));

  return trips;
};


// -------------------------
// Delete a trip (and its passengers)
// -------------------------
export const deleteTrip = async (tripId: string) => {
  // 1. Delete all passengers in subcollection
  const passengersCol = collection(db, "trips", tripId, "passengers");
  const passengersSnap = await getDocs(passengersCol);

  const batch = writeBatch(db);
  passengersSnap.forEach((passengerDoc) => {
    batch.delete(passengerDoc.ref);
  });

  // 2. Delete the trip itself
  const tripRef = doc(db, "trips", tripId);
  batch.delete(tripRef);

  // 3. Commit batch
  await batch.commit();
};


// -------------------------
// Add a new passenger under a trip
// -------------------------
export const addPassenger = async (tripId: string, passenger: Passenger) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const passengerRef = await addDoc(collection(db, "trips", tripId, "passengers"), {
    ...passenger,
    totalAmount: Number(passenger.totalAmount),
    advanceAmount: Number(passenger.advanceAmount),
    createdAt: new Date(),
    userId: user.uid,
  });

  return passengerRef.id;
};

// -------------------------
// Update an existing passenger
// -------------------------
export const updatePassenger = async (tripId: string, passengerId: string, updatedData: Partial<Passenger>) => {
  const passengerRef = doc(db, "trips", tripId, "passengers", passengerId);
  await updateDoc(passengerRef, {
    ...updatedData,
    updatedAt: new Date(),
  });
};

// -------------------------
// Delete a passenger
// -------------------------
export const deletePassenger = async (tripId: string, passengerId: string) => {
  const passengerRef = doc(db, "trips", tripId, "passengers", passengerId);
  await deleteDoc(passengerRef);
};

// -------------------------
// Fetch all passengers for a trip
// -------------------------
export const getPassengersForTrip = async (tripId: string) => {
  const passengersCol = collection(db, "trips", tripId, "passengers");
  const passengersSnap = await getDocs(passengersCol);

  return passengersSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Passenger),
  }));
};


export const getPassengerById = async (tripId: string, passengerId: string) => {
  try {
    const passengerRef = doc(db, "trips", tripId, "passengers", passengerId);
    const passengerSnap = await getDoc(passengerRef);

    if (!passengerSnap.exists()) {
      console.warn(`Passenger ${passengerId} not found in trip ${tripId}`);
      return null;
    }

    return { id: passengerSnap.id, ...passengerSnap.data() } as Passenger & { id: string };
  } catch (error) {
    console.error("Error fetching passenger:", error);
    throw error;
  }
};

// -------------------------
// Fetch all passengers for the agency (user) irrespective of trip
// -------------------------
export const getAllPassengersForAgency = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  // 1. Get all trips for this user
  const trips = await getTripsForAgency();

  const allPassengers: (Passenger & { id: string; tripId: string })[] = [];

  // 2. Loop through each trip and get passengers
  for (const trip of trips) {
    const passengersCol = collection(db, "trips", trip.id, "passengers");
    const passengersSnap = await getDocs(passengersCol);

    passengersSnap.docs.forEach((doc) => {
      allPassengers.push({
        id: doc.id,
        tripId: trip.id,
        ...(doc.data() as Passenger),
      });
    });
  }

  return allPassengers;
};

// services/whatsappService.ts
export const sendWhatsAppMessage = (phoneNumbers: string[], message: string) => {
  if (!phoneNumbers.length) return;

  const encodedMessage = encodeURIComponent(message);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  phoneNumbers.forEach((phone) => {
    const url = isMobile
      ? `whatsapp://send?phone=${phone}&text=${encodedMessage}` // Mobile deep link
      : `https://wa.me/${phone}?text=${encodedMessage}`;        // Desktop/Web link

    window.open(url, "_blank");
  });
};
