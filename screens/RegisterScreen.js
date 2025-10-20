import React, { useState, useLayoutEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image, Input, Button, Text } from "react-native-elements";
import { auth } from "../firebase.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const signUp = async () => {
    try {
      // 1️⃣ Create the user
      await createUserWithEmailAndPassword(auth, email, password);
      clearInput();

      // 2️⃣ Wait for auth state to settle and update display name
      onAuthStateChanged(auth, async (user) => {
        if (user && !user.displayName) {
          await updateProfile(user, { displayName: name });
          // Navigate to Home or other screen
          // navigation.replace("Home");
        }
      });
    } catch (error) {
      console.error(error.code, error.message);
      Alert.alert("Error", error.message);
    }
  };
  const clearInput = () => {
    alert("Account Created");
    navigation.navigate("Home");
    setName("");
    setEmail("");
    setPassword("");
    setSubmitLoading(false);
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar style="light" />
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
        }}
        style={{ width: 300, height: 300, marginBottom: 50 }}
      />

      <Text h4 style={{ marginBottom: 50 }}>
        Create Account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Name"
          type="text"
          autoFocus
          value={name}
          onChangeText={(text) => setName(text)}
        />

        <Input
          placeholder="Email"
          value={email}
          onChangeText={(mail) => setEmail(mail)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(pass) => setPassword(pass)}
        />
        <Button
          title="Register"
          containerStyle={styles.button}
          onPress={signUp}
          loading={submitLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 300,
    marginTop: 10,
  },
});
