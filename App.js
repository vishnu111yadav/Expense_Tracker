import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AddScreen from "./screens/AddScreen";
import UpdateScreen from "./screens/UpdateScreen";
import AllTransactions from "./screens/AllTransactions";

const Stack = createStackNavigator();

export default function App() {
  const globalScreenOptions = {
    headerStyle: { backgroundColor: "#DDD5F1" },
   // headerTitleStyle: { color: "white" },
    headerTintColor: "black",
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add" component={AddScreen} />
        <Stack.Screen name="Update" component={UpdateScreen} />
        <Stack.Screen name="All" component={AllTransactions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
