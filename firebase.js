import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBulwCaxX_NoWqdgHmcHk1OUyjDCZcKLZU",
  authDomain: "myapp2-5e7f1.firebaseapp.com",
  projectId: "myapp2-5e7f1",
  storageBucket: "myapp2-5e7f1.firebasestorage.app",
  messagingSenderId: "420667248587",
  appId: "1:420667248587:web:a4a5a73ca0334c4c22b04e",
  measurementId: "G-JH27ECVCE9",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
