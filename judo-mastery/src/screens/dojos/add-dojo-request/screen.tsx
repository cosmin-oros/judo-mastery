import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { firestore } from "@/src/provider/auth/firebase";
import { collection, addDoc, serverTimestamp, GeoPoint } from "firebase/firestore";

const AddDojoRequest: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitRequest = async () => {
    // Validate required fields
    if (!name || !latitude || !longitude) {
      Alert.alert(
        t("dojos.validationTitle") || "Validation Error",
        t("dojos.validationMessage") || "Please fill in all the required fields."
      );
      return;
    }
    try {
      setSubmitting(true);
      await addDoc(collection(firestore, "dojos"), {
        name,
        address,
        // Save coordinates as a Firestore GeoPoint.
        coordinates: new GeoPoint(Number(latitude), Number(longitude)),
        approved: false, // New submissions require manual approval.
        submittedAt: serverTimestamp(),
      });
      Alert.alert(
        t("dojos.saveSuccessTitle") || "Success",
        t("dojos.saveSuccessMessage") || "Your dojo request has been submitted for review."
      );
      // Clear the form
      setName("");
      setAddress("");
      setLatitude("");
      setLongitude("");
    } catch (error) {
      console.error("Error submitting dojo request:", error);
      Alert.alert(
        t("dojos.saveErrorTitle") || "Error",
        t("dojos.saveErrorMessage") || "There was an error submitting your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("dojos.addTitle") || "Add a Dojo"}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("dojos.namePlaceholder") || "Enter dojo name"}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder={t("dojos.addressPlaceholder") || "Enter address"}
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder={t("dojos.latitudePlaceholder") || "Enter latitude"}
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder={t("dojos.longitudePlaceholder") || "Enter longitude"}
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />
      <Button
        title={
          submitting
            ? t("dojos.submitting") || "Submitting..."
            : t("dojos.submitButton") || "Submit Dojo Request"
        }
        onPress={submitRequest}
        disabled={submitting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
});

export default AddDojoRequest;
