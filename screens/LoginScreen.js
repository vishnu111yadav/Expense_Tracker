import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image, Input, Button, Text } from "react-native-elements";
import { auth } from "../firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const signIn = () => {
    if (email && password) {
      setSubmitLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then(() => clearInput())
        .catch((error) => alert(error))
        .finally(() => setSubmitLoading(false));
    } else {
      alert("Fill All The Required Fields");
      setSubmitLoading(false);
    }
  };

  const clearInput = () => {
    alert("Successfully Logged In");
    navigation.replace("Home");
    setEmail("");
    setPassword("");
    setSubmitLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        navigation.replace("Home");
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Loading...",
    });
    if (!loading) {
      navigation.setOptions({
        title: "Login",
      });
    }
  }, [navigation, loading]);

  return (
    <>
      {!loading ? (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <StatusBar style="light" />
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
            }}
            style={{ width: 300, height: 300, marginBottom: 50 }}
          />
          <View style={styles.inputContainer}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChangeText={(mail) => setEmail(mail)}
            />
            <Input
              type="password"
              placeholder="Password"
              secureTextEntry
              onChangeText={(pwd) => setPassword(pwd)}
            />
            <Button
              title="Login"
              containerStyle={styles.button}
              onPress={signIn}
            />
            <Button
              title="Register"
              containerStyle={styles.button}
              onPress={() => {
                navigation.navigate("Register");
              }}
            />
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.container}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
            }}
            style={{ width: 300, height: 300, marginBottom: 50 }}
          />
          <Text h4>Loading...</Text>
        </View>
      )}
    </>
  );
};
export default LoginScreen;

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
