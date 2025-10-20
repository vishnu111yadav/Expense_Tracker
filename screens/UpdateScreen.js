import React, { useEffect, useLayoutEffect, useState } from "react";
import { Text, Button } from "react-native-elements";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { DateTimePickerResult } from "@react-native-community/datetimepicker";
import format from "date-fns/format";
import { Picker } from "@react-native-picker/picker";
// import { db, auth } from "../firebase.js";
import { StatusBar } from "expo-status-bar";
// import firebase from "firebase";
import { parse } from "date-fns";
const UpdateScreen = ({ route, navigation }) => {
  const [transaction, setTransaction] = useState([]);
  const [input, setInput] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState("expense");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  useEffect(() => {
    db.collection("expence")
      .doc(itemId)
      .onSnapshot((snapshot) => {
        setInput(snapshot.data()?.text) &
          setAmount(snapshot.data()?.price) &
          setDate(parse(snapshot.data()?.userDate, "dd/MM/yyyy", new Date())) &
          setSelected(snapshot.data()?.type);
      });
  }, []);
  const { itemId } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Update Expense",
    });
  }, [navigation]);
  // const updateExpense = () => {
  //   if (input && amount && date && selected ) {
  //     setSubmitLoading(true);
  //     db.collection("expense").doc(itemId)
  //       .update({
  //         text: input,
  //         price: amount,
  //         type: selected,
  //         Timestamp: new Date(),
  //         userDate: result
  //       })
  //       .then(() => {
  //         clearInput();
  //       })
  //       .catch((error) => alert(error.message));
  //   } else {
  //     alert("All fields Are Required");
  //     setSubmitLoading(false);
  //   }
  // };

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
          <DateTimePickerResult
            value={date.toDateString()}
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
          value={result ? result : new Date()}
          // onPress={showDatepicker}
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
          // onPress={updateExpense}
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
