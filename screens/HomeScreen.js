import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import { auth, db } from "../firebase.js";
import { CustomListItem } from "../components/CustomListItem";
import { StatusBar } from "expo-status-bar";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [totalIncome, setTotalIncome] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalExpense, setTotalExpense] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    // Create a query for the current user's expenses
    const q = query(
      collection(db, "expense"),
      where("email", "==", auth?.currentUser?.email),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Map documents to objects
        const transactions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(transactions);

        const incomesArray = snapshot.docs.map((doc) => {
          const data = doc.data();
          return data?.email === auth?.currentUser?.email &&
            data?.type === "income"
            ? Number(data?.price) || 0
            : 0;
        });

        const expensesArray = snapshot.docs.map((doc) => {
          const data = doc.data();
          return data?.email === auth?.currentUser?.email &&
            data?.type === "expense"
            ? Number(data?.price) || 0
            : 0;
        });

        // Set state arrays (if you want to keep individual amounts)
        setTotalIncome(incomesArray);
        setTotalExpense(expensesArray);
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (totalIncome) {
      if (totalIncome?.length == 0) {
        setIncome(0);
      } else {
        setIncome(totalIncome?.reduce((a, b) => Number(a) + Number(b), 0));
      }
    }
    if (totalExpense) {
      if (totalExpense?.length == 0) {
        setExpense(0);
      } else {
        setExpense(totalExpense?.reduce((a, b) => Number(a) + Number(b), 0));
      }
    }
  }, [totalExpense, totalIncome, income, expense]);

  useEffect(() => {
    if (income || expense) {
      setTotalBalance(income - expense);
    } else {
      setTotalBalance(0);
    }
  }, [totalExpense, totalExpense, income, expense]);

  useEffect(() => {
    if (transactions) {
      setFilter(
        transactions.filter((transaction) => {
          return transaction?.email === auth.currentUser.email; // ✅ return
        })
      );
    }
  }, [transactions]);

  const signOutUser = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => alert(error.message));
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${auth?.currentUser?.displayName}`,
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
            <Text style={{ fontWeight: "bold" }}>LogOut</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={{ alignItems: "center", color: "white" }}>
              Total Balance
            </Text>
            <Text style={{ alignItems: "center", color: "white" }} h3>
              $ {totalBalance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.cardBottom}>
            <View>
              <View style={styles.cardBottomSame}>
                <Feather name="arrow-down" size={18} color="green" />
                <Text
                  style={{
                    alignItems: "center",
                    marginLeft: 5,
                  }}
                >
                  Income
                </Text>
              </View>
              <Text h4 style={{ textAlign: "center" }}>
                $ {income.toFixed(2)}
              </Text>
            </View>
            <View>
              <View style={styles.cardBottomSame}>
                <Feather name="arrow-up" size={18} color="red" />
                <Text
                  style={{
                    alignItems: "center",
                    marginLeft: 5,
                  }}
                >
                  Expense
                </Text>
              </View>
              <Text h4 style={{ textAlign: "center" }}>
                $ {expense.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.recentTitle}>
          <Text h4>Recent Transactions</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("All")}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {filter?.length > 0 ? (
          <View style={styles.recentTransactions}>
            {filter?.slice(0, 3).map((info) => (
              <View key={info.id}>
                <CustomListItem
                  key={info.id}
                  info={info}
                  navigation={navigation}
                  id={info.id}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.containerNull}>
            <FontAwesome5 name="list-alt" size={24} />
            <Text h4>No Transactions</Text>
          </View>
        )}
      </View>
      <View style={styles.addButton}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Home")}
        >
          <AntDesign name="home" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Add")}
        >
          <AntDesign name="plus" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("All")}
        >
          <FontAwesome5 name="list-alt" size={24} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 10,
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  fullName: {
    flexDirection: "row",
  },
  card: {
    backgroundColor: "black",
    alignItems: "center",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    marginVertical: 20,
  },
  cardTop: {
    // backgroundColor: "blue",
    marginBottom: 20,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: "auto",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
  },
  cardBottomSame: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  recentTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  recentTransactions: {
    backgroundColor: "white",
    width: "100%",
  },
  seeAll: {
    fontWeight: "bold",
    color: "green",
    fontSize: 18,
  },
  containerNull: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    alignSelf: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    padding: 15,
    backgroundColor: "green",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
