import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";

import { useAuthContext } from "@/hooks/useAuthContext";
import CtaButton from "@/components/CtaButton";

export default function TabTwoScreen() {
  const { signOut, isLoading } = useAuthContext();

  return (
    <View style={styles.container}>
      <CtaButton title={"Logout"} onPress={signOut} isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
