import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Product } from "@/services/api";
import { router } from "expo-router";

const ProductCard = (item: Product) => {
  const onPress = () => {
    router.push({
      pathname: "/product",
      params: { ...item },
    });
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text>{item.name}</Text>
      <Text>{item.price}</Text>
      <Text>{item.category}</Text>
      <Text>{item.dateAdded}</Text>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    padding: 2,
    borderColor: "black",
    borderWidth: 1,
  },
});
