import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import "firebase/firestore";
import { fetchDojos } from "@/src/firestoreService/dojosService";

// Define your Dojo type.
type Dojo = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  approved: boolean;
};

const DojosScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [dojos, setDojos] = useState<Dojo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      // Request permission to access the location.
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg(
          t("common.permissionDenied") || "Permission to access location was denied"
        );
        setLoading(false);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        const fetched = await fetchDojos(loc.coords);
        setDojos(fetched);
      } catch (error) {
        console.error("Error getting location or fetching dojos:", error);
        setErrorMsg(t("common.locationError") || "Error retrieving location");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text, marginTop: 10 }}>
          {t("common.loading") || "Loading..."}
        </Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            // These deltas roughly cover the queried area.
            latitudeDelta: 1,
            longitudeDelta: 1,
          }}
          showsUserLocation
        >
          {dojos.map((dojo) => (
            <Marker
              key={dojo.id}
              coordinate={{ latitude: dojo.lat, longitude: dojo.lon }}
              title={dojo.name}
            />
          ))}
        </MapView>
      )}
      <ScrollView style={[styles.listContainer, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.listTitle, { color: theme.colors.text }]}>
          {t("dojos.nearbyTitle") || "Judo Dojos Near You"}
        </Text>
        {dojos.length === 0 ? (
          <Text style={{ color: theme.colors.text, padding: 10 }}>
            {t("dojos.noDojosFound") || "No judo dojos found near you."}
          </Text>
        ) : (
          dojos.map((dojo) => (
            <View key={dojo.id} style={styles.listItem}>
              <Text style={[styles.dojoName, { color: theme.colors.text }]}>{dojo.name}</Text>
              <Text style={[styles.dojoCoords, { color: theme.colors.placeholder }]}>
                ({dojo.lat.toFixed(4)}, {dojo.lon.toFixed(4)})
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  map: { flex: 1 },
  listContainer: { maxHeight: 200, paddingHorizontal: 15, paddingVertical: 10 },
  listTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  listItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  dojoName: { fontSize: 16, fontWeight: "600" },
  dojoCoords: { fontSize: 12 },
});

export default DojosScreen;
