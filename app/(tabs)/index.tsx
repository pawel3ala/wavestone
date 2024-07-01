import { StyleSheet, Text, FlatList, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import FloatingButton from "@/components/FloatingButton";
import { router } from "expo-router";
import { useCallback } from "react";
import { useGetProductsQuery } from "@/services/api";
import ProductCard from "@/components/ProductCard";

export default function HomeScreen() {
  const { data } = useGetProductsQuery();

  const onPress = useCallback(() => {
    router.push("/product");
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={{
          flex: 1,
          width: "100%",
        }}
        data={data}
        renderItem={(item) => <ProductCard {...item} />}
      />
      <FloatingButton onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
});
