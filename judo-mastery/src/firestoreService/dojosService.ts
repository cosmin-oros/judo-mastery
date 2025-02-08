import { getDocs, collection } from "firebase/firestore";
import { firestore } from "@/src/provider/auth/firebase";
import { LocationObjectCoords } from "expo-location";
import { getDistanceFromLatLonInKm } from "../utils/helpers";

// Define your Dojo type.
type Dojo = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  approved: boolean;
};

export const fetchDojos = async (
  coords: LocationObjectCoords
): Promise<Dojo[]> => {
  // Define the maximum distance (in kilometers) from the user’s location.
  const maxDistanceKm = 100;

  // Fetch all documents from the "dojos" collection.
  const dojosSnapshot = await getDocs(collection(firestore, "dojos"));

  // Map the snapshot into an array of Dojo objects.
  const allDojos: Dojo[] = dojosSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "Unknown Dojo",
      // Expecting a Firestore GeoPoint stored under the field "coordinates"
      lat: data.coordinates?.latitude,
      lon: data.coordinates?.longitude,
      approved: data.approved,
    } as Dojo;
  });

  // Filter for approved dojos and (optionally) by distance from the user's location.
  const filteredDojos = allDojos.filter((dojo) => {
    if (!dojo.approved) return false;
    // If coordinates are missing, skip the dojo.
    if (typeof dojo.lat !== "number" || typeof dojo.lon !== "number")
      return false;
    const distance = getDistanceFromLatLonInKm(
      coords.latitude,
      coords.longitude,
      dojo.lat,
      dojo.lon
    );
    return distance <= maxDistanceKm;
  });

  return filteredDojos;
};
