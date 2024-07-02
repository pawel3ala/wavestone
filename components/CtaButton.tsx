import { TouchableOpacity, StyleSheet, Text, ViewStyle } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const CtaButton = ({
  onPress,
  title,
  isLoading,
  style,
}: {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  style?: ViewStyle;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      {isLoading ? (
        <ActivityIndicator animating={isLoading} color="white" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CtaButton;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#00A76F",
    width: "100%",
    padding: 10,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
