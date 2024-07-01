import { Button, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ProductCategory,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/services/api";
import TextInput from "@/components/TextInput";
import { TextInput as TextInputRNP } from "react-native-paper";
import { useLocalSearchParams, useNavigation } from "expo-router";

interface FormInputs {
  name: string;
  price: string;
  category: ProductCategory;
  dateAdded: string;
}
const iso8601Regex =
  /^(\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2})))?)$/;

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  category: z.nativeEnum(ProductCategory),
  dateAdded: z.string().refine((val) => iso8601Regex.test(val), {
    message: "Invalid ISO 8601 date format",
  }),
});

const Product = () => {
  const navigation = useNavigation();
  const defaultValues = useLocalSearchParams();
  const [create, { isLoading: isLoadingCreate, isSuccess, error }] =
    useCreateProductMutation();
  const [update, { isLoading: isLoadingUpdate }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isLoadingDelete }] =
    useDeleteProductMutation();

  const isEditing = defaultValues.id !== undefined;
  const [isModified, setIsModified] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setIsModified(
        isEditing &&
          defaultValues &&
          JSON.stringify(value) !== JSON.stringify(defaultValues)
      );
    });
    return () => subscription.unsubscribe();
  }, [defaultValues, watch]);

  const onAdd = useCallback(
    handleSubmit(async (data) => {
      console.log("onAdd");

      try {
        const response = await create(data);
        if (response.error) {
          console.log(JSON.stringify(response));
        }
        navigation.goBack();
      } catch (error) {
        console.log(error);
      }
    }),
    [create]
  );

  const onSave = useCallback(
    handleSubmit(async (data) => {
      console.log("onSave");

      try {
        const response = await update({
          id: defaultValues.id,
          ...data,
        });
        console.log(response);
        navigation.goBack();
      } catch (error) {
        console.log(error);
      }
    }),
    [update, defaultValues.id]
  );

  const onDelete = useCallback(async () => {
    try {
      const response = await deleteProduct(defaultValues.id);
      console.log(response);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }, [deleteProduct, defaultValues.id]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title={isModified ? "Save" : isEditing ? "Delete" : "Add"}
          onPress={isModified ? onSave : isEditing ? onDelete : onAdd}
        />
      ),
      headerLeft: () => <Button title="Back" onPress={navigation.goBack} />,
      headerTitle: isEditing ? "Edit Product" : "Add Product",
    });
  }, [navigation, onAdd, onSave, onDelete, isModified, isEditing]);

  return (
    <>
      <ThemedView style={styles.container}>
        <View style={{ justifyContent: "center", width: "100%" }}>
          <TextInput
            control={control}
            name="name"
            label="Name"
            isError={errors.name?.message != null}
            style={styles.textInput}
          />
          {errors.name?.message != null && <Text>{errors.name.message}</Text>}
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}></View>
        <View style={{ justifyContent: "center", width: "100%" }}>
          <TextInput
            control={control}
            name="price"
            label="Price"
            isError={errors.price?.message != null}
            style={styles.textInput}
          />
          {errors.price?.message != null && <Text>{errors.price.message}</Text>}
        </View>
        <View style={{ justifyContent: "center", width: "100%" }}>
          <TextInput
            control={control}
            name="category"
            label="Category"
            isError={errors.category?.message != null}
            style={styles.textInput}
          />
          {errors.category?.message != null && (
            <Text>{errors.category.message}</Text>
          )}
        </View>
        <View style={{ justifyContent: "center", width: "100%" }}>
          <TextInput
            control={control}
            name="dateAdded"
            label="Date"
            isError={errors.dateAdded?.message != null}
            style={styles.textInput}
            right={
              <TextInputRNP.Icon
                style={{ bottom: -3 }} //TODO: remove hardcoded value,make it dynamic
                icon="calendar"
                onPress={() => {}}
              />
            }
          />
          {errors.dateAdded?.message != null && (
            <Text>{errors.dateAdded.message}</Text>
          )}
        </View>
      </ThemedView>
    </>
  );
};

export default Product;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  textInput: {
    marginBottom: 10,
  },
});
