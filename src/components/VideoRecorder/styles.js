import { StyleSheet } from "react-native";
export default styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: "black"
    },
    preview: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 35
    },
    capture: {
      flex: 0,
      backgroundColor: "#ff3b30",
      width: 100,
      height: 100,
      borderRadius: 40,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: "center",
      margin: 20,
      borderWidth: 3,
      borderColor: "#fff"
    },
    captureButton: {
      width: 65,
      height: 65,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: "center",
      // margin: 20
    },
    progressBar: {
      borderRadius: 3.5,
      borderColor: "#fff",
      borderWidth: 0.5,
      height: 7,
      width: '90%',
      marginLeft: 10,
      marginRight: 10
    }
  });