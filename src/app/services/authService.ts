// authService.ts
import { auth, db } from "@/firebase/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// -------------------------
// Register / Signup
// -------------------------
export const registerUser = async (
  name: string,
  email: string,
  agencyName: string,
  password: string,
  phone: string,
  city: string,
  state: string,
  pincode: string,
  officeAddress: string,
  officePhone: string,
  instagramLink: string,
  facebookLink: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  await setDoc(doc(db, "travelAgencies", user.uid), {
    name,
    email,
    agencyName,
    phone,
    city,
    state,
    pincode,
    officeAddress,
    officePhone,
    instagramLink,
    facebookLink,
    createdAt: new Date(),
  });

  return user;
};

// -------------------------
// Login
// -------------------------
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};
