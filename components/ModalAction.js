import React from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  View,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, EvilIcons, FontAwesome5 } from "@expo/vector-icons";
import { db } from "../firebase";

const ModalAction = ({ modalVisible, setModalVisible, id, navigation }) => {
  const deleteExpense = () => {
    db.collection("expense")
      .doc(id)
      .delete()
      .then(() => {
        alert("Deleted Successfully");
      })
      .catch((error) => alert(error.message));
  };
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.closeIcon}>
              <Pressable
                style={[styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <FontAwesome5 name="times-circle" size={24} color="black" />
              </Pressable>
            </View>
            <View style={styles.handleIcons}>
              <TouchableOpacity activeOpacity={0.5} style={styles.pencil}>
                <EvilIcons
                  name="pencil"
                  size={40}
                  color="#61ACb8"
                  onPress={() => {
                    navigation.navigate("update", {
                      itemId: id,
                    }) & setModalVisible(!modalVisible);
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} style={styles.trash}>
                <FontAwesome
                  name="trash-0"
                  size={32}
                  onPress={() => deleteExpense()}
                  color="red"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default ModalAction;

const styles = StyleSheet.create({
  pencil: {
    backgroundColor: "aliceblue",
    padding: 8,
    borderRadius: 10,
  },
  trash: {
    backgroundColor: "aliceblue",
    paddingVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  handleIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
