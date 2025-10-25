import React, { useLayoutEffect, useState } from "react";
import { Text, Button } from "react-native-elements";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import format from "date-fns/format";
import { Picker } from "@react-native-picker/picker";
import { db, auth } from "../firebase.js";
import { StatusBar } from "expo-status-bar";
// import firebase from "firebase";

const AddScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [input, setInput] = useState("");
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState("expense");
  const [submitLoading, setSubmitLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add Expense",
    });
  }, [navigation]);

  const createExpense = async () => {
    if (input && amount && date && selected && auth?.currentUser) {
      try {
        setSubmitLoading(true);
        await addDoc(collection(db, "expense"), {
          email: auth.currentUser.email,
          text: input,
          price: amount,
          type: selected,
          date: date.toISOString(),
          timestamp: serverTimestamp(),
        });
        clearInput();
        alert("Expense saved!");
      } catch (error) {
        alert(error.message);
      } finally {
        setSubmitLoading(false);
      }
    } else {
      alert("All fields are required");
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
          onPress={createExpense}
          loading={submitLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
export default AddScreen;

const styles = {
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
  input: {
    height: 50,
    borderColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
};
