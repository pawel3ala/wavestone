import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

const BUTTON_HIGHT = 60;

export default function FloatingButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={styles.container}
      onPress={onPress}
    >
      <MaterialIcons
        style={{
          transform: [{ rotate: "-45deg" }],
          justifyContent: "center",
          alignSelf: "center",
        }}
        size={BUTTON_HIGHT / 2}
        name="add"
        color={"black"} // TODO
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    bottom: 30,
    right: 30,
    elevation: 4,
    justifyContent: "center",
    position: "absolute",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    height: BUTTON_HIGHT,
    width: BUTTON_HIGHT,
    borderRadius: BUTTON_HIGHT / 2,
    transform: [{ rotate: "-45deg" }],
    alignContent: "center",
  },
});
