import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View, Text } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextInput from "@/components/TextInput";
import CtaButton from "@/components/CtaButton";
import { useAuthContext } from "@/hooks/useAuthContext";

interface FormInputs {
  username: string;
  password: string;
}

const schema = z.object({
  username: z.string().min(1) && z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }), //TODO: add more stuff
});

const defaultValues = {
  username: "Pablo",
  password: "Abecadlo1$",
};

export default function Register() {
  const { register, isLoading } = useAuthContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ username, password }: FormInputs) => {
    const data = await register(username, password);

    console.log(data);
  };

  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
          Sign up to your account
        </ThemedText>
        <View style={{ justifyContent: "center", width: "100%" }}>
          <TextInput
            control={control}
            name="username"
            label="Username"
            isError={errors.username?.message != null}
            style={styles.textInput}
          />
          {errors.username?.message != null && (
            <Text>{errors.username.message}</Text>
          )}
        </View>
        <View style={{ justifyContent: "center", width: "100%" }}>
          <TextInput
            control={control}
            name="password"
            label="Password"
            secureTextEntry={true}
            isError={errors.password?.message != null}
            style={styles.textInput}
          />
          {errors.password?.message != null && (
            <Text>{errors.password.message}</Text>
          )}
        </View>
        <CtaButton
          title={"Sign Up"}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
        />
      </ThemedView>
    </>
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
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  textInput: {
    marginBottom: 10,
  },
});
