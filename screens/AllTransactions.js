import React, { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomListItem } from "../components/CustomListItem";
import { auth, db } from "../firebase.js";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { Text } from "react-native-elements";
import { FontAwesome5 } from "@expo/vector-icons";

const AllTransactions = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "All Transactions",
    });
  }, []);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState([]);
  useEffect(() => {
    const q = query(
      collection(db, "expense"),
      where("email", "==", auth?.currentUser?.email),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const transactions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(transactions);
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (transactions) {
      setFilter(
        transactions.filter((transaction) => {
          return transaction?.email === auth.currentUser.email; // ✅ return
        })
      );
    }
  }, [transactions]);

  return (
    <>
      {filter.length > 0 ? (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            {filter.map((info) => (
              <View key={info.id}>
                <CustomListItem
                  key={info.id}
                  info={info}
                  navigation={navigation}
                  id={info.id}
                />
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      ) : (
        <>
          <View style={styles.containerNull}>
            <FontAwesome5 name="list-alt" size={24} />
            <Text h4 style={{ color: "green" }}>
              No Transaction
            </Text>
          </View>
        </>
      )}
    </>
  );
};

export default AllTransactions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 0,
    marginTop: -23,
  },
  containerNull: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
