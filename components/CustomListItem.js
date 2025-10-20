import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { ListItem, Text, Divider } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import ModalAction from "./ModalAction";

const CustomListItem = ({ info, navigation, id }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View>
        <ListItem onPress={() => setModalVisible(true)}>
          {info.type === "expense" ? (
            <View style={styles.left}>
              <MaterialIcons name="money-off" size={24} color="white" />
            </View>
          ) : (
            <View style={styles.income}>
              <MaterialIcons name="attach-money" size={24} color="white" />
            </View>
          )}
          <ListItem.Content>
            <ListItem.Title
              style={{ fontWeight: "bold", textTransform: "capitalize" }}
            >
              {info?.text}
            </ListItem.Title>
            <ListItem.Subtitle>{info?.userDate}</ListItem.Subtitle>
          </ListItem.Content>
          <View>
            {info.type === "expense" ? (
              <Text style={styles.right}>
                - $ {Number(info?.price).toFixed(2)}
              </Text>
            ) : (
              <Text style={styles.rightIncome}>
                + $ {Number(info?.price).toFixed(2)}
              </Text>
            )}
          </View>
        </ListItem>
        <Divider style={{ backgroundColor: "lightgrey" }} />
      </View>
      <ModalAction
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        id={id}
        navigation={navigation}
      />
    </>
  );
};

const styles = StyleSheet.create({
  left: {
    backgroundColor: "#533461",
    borderRadius: 8,
    padding: 10,
  },
  income: {
    backgroundColor: "#61ACb8",
    borderRadius: 8,
    padding: 10,
  },
  right: {
    fontWeight: "bold",
    color: "red",
  },
  rightIncome: {
    fontWeight: "bold",
    color: "green",
  },
});
