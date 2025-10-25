import React, { useEffect, useLayoutEffect, useState } from "react";
import { Text, Button } from "react-native-elements";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import format from "date-fns/format";
import { Picker } from "@react-native-picker/picker";
import { db, auth } from "../firebase.js";
import {
  collection,
  doc,
  updateDoc,
  getDocs,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { StatusBar } from "expo-status-bar";
// import firebase from "firebase";
import { parseISO } from "date-fns";
const UpdateScreen = ({ route, navigation }) => {
  const [transaction, setTransaction] = useState([]);
  const [input, setInput] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState("expense");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const { itemId } = route.params;
  useEffect(() => {
    if (!itemId) return;

    // Reference to the document
    const docRef = doc(db, "expense", itemId);

    // Subscribe to realtime updates
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const data = snapshot.data();
      if (data) {
        setInput(data.text);
        setAmount(data.price);
        const jsDate = parseISO(data.date);
        setDate(jsDate);
        setSelected(data.type);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [itemId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Update Expense",
    });
  }, [navigation]);

  const updateExpense = async () => {
    if (!input || !amount || !date || !selected) {
      alert("All fields are required");
      return;
    }

    try {
      setSubmitLoading(true);

      const docRef = doc(db, "expense", itemId); // reference to the document
      await updateDoc(docRef, {
        text: input,
        price: Number(amount),
        type: selected,
        timestamp: serverTimestamp(), // Firestore timestamp
        userDate: result, // formatted date string if needed
      });

      clearInput();
      alert("Expense updated!");
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };
  const clearInput = () => {
    alert("Expense Added Successfully");
    setInput("");
    setAmount("");
    setDate(new Date());
    setSelected("expense");
    navigation.navigate("Home");
    setSubmitLoading(false);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };
  const result = format(date, "dd/MM/yyyy");

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.inputContainer}>
        <TextInput
          h4
          style={styles.input}
          placeholder="Add Text"
          value={input}
          onChangeText={(text) => {
            setInput(text);
          }}
        />
        {show && (
          <DateTimePicker
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Add Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={(number) => {
            setAmount(number);
          }}
        />
        <Text
          h4
          style={styles.input}
          placeholder="Select Date"
          value={result}
          onPress={showDatepicker}
        >
          {result ? result : new Date()}
        </Text>
        <Picker
          selectedValue={selected}
          onValueChange={(itemValued) => {
            setSelected(itemValued);
          }}
        >
          <Picker.Item label="Expense" value="expense" />
          <Picker.Item label="Income" value="income" />
        </Picker>
        <Button
          containerStyle={styles.button}
          title="Add"
          onPress={updateExpense}
          loading={submitLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
