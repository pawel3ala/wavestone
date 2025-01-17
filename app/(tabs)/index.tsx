import {
  StyleSheet,
  FlatList,
  View,
  Button,
  ListRenderItem,
} from "react-native";

import FloatingButton from "@/components/FloatingButton";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Product,
  ProductCategory,
  SortBy,
  SortingOrder,
  useGetProductsQuery,
} from "@/services/api";
import ProductCard from "@/components/ProductCard";
import { Chip } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";

export default function HomeScreen() {
  const { data } = useGetProductsQuery();
  const [products, setProducts] = useState(data);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);

  const [sortBy, setSortBy] = useState<{ key: SortBy; order: SortingOrder }>({
    key: SortBy.NAME,
    order: SortingOrder.ASC,
  });

  const onPress = useCallback(() => {
    router.push("/product");
  }, []);

  useEffect(() => {
    setProducts(
      data
        ?.filter((product) => {
          if (!selectedCategory) return true;
          return product.category === selectedCategory;
        })
        //TODO: Extract to separate function
        .sort((a, b) => {
          if (sortBy.key === SortBy.NAME) {
            return sortBy.order === SortingOrder.ASC
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          }
          if (sortBy.key === SortBy.PRICE) {
            return sortBy.order === SortingOrder.ASC
              ? a.price - b.price
              : b.price - a.price;
          }
          if (sortBy.key === SortBy.DATE_ADDED) {
            return sortBy.order === SortingOrder.ASC
              ? new Date(a.dateAdded).getTime() -
                  new Date(b.dateAdded).getTime()
              : new Date(b.dateAdded).getTime() -
                  new Date(a.dateAdded).getTime();
          }
          if (sortBy.key === SortBy.CATEGORY) {
            return sortBy.order === SortingOrder.ASC
              ? a.category.localeCompare(b.category)
              : b.category.localeCompare(a.category);
          }
          return 0;
        })
    );
  }, [selectedCategory, data, sortBy]);

  const getIconForSortByChip = (sortByItem: SortBy) => {
    if (sortBy.key !== sortByItem) return null;
    if (sortBy.order === "asc") {
      return <Feather name="arrow-down" size={24} color="black" />;
    }
    return <Feather name="arrow-up" size={24} color="black" />;
  };

  const onSortByPress = (key: SortBy) => {
    setSortBy((prev) => ({
      ...prev,
      key,
      order:
        prev.order === SortingOrder.ASC ? SortingOrder.DESC : SortingOrder.ASC,
    }));
  };

  const renderItem: ListRenderItem<Product> = ({ item, index }) => {
    return (
      <Animated.View
        entering={FadeInLeft.delay(index * 100)}
        exiting={FadeOutRight}
      >
        <ProductCard {...item} />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chipsContainer}>
        {Object.values(ProductCategory).map((category) => (
          <View key={category}>
            <Chip
              key={category}
              compact
              mode="outlined"
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            >
              {category}
            </Chip>
          </View>
        ))}
        <Button
          title="Reset"
          onPress={() => setSelectedCategory(null)}
          disabled={selectedCategory === null}
        />
      </View>
      <View style={styles.chipsContainer}>
        {Object.values(SortBy).map((sortByItem) => (
          <Chip
            key={sortByItem}
            mode="outlined"
            icon={() => getIconForSortByChip(sortByItem)}
            onPress={() => onSortByPress(sortByItem)}
            compact
          >
            {sortByItem}
          </Chip>
        ))}
      </View>
      <FlatList
        style={styles.listContainer}
        contentContainerStyle={{
          gap: 10,
        }}
        data={products}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        renderItem={renderItem}
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
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 50, // TODO: to be removed
  },
  listContainer: {
    flex: 1,
    width: "100%",
  },
  chipsContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
