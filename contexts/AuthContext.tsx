import { useStorageState } from "@/hooks/useStorageState";
import { useLoginMutation, useRegisterMutation } from "@/services/api";
import React from "react";
import { Alert } from "react-native";

export const AuthContext = React.createContext<{
  login: (username: string, password: string) => Promise<any>;
  register: (username: string, password: string) => Promise<any>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  login: () => Promise.resolve(null),
  register: () => Promise.resolve(null),
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function AuthContextProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  const [loginMutation, { isLoading: isLoadingLogin }] = useLoginMutation();
  const [registerMutation, { isLoading: isLoadingRegister }] =
    useRegisterMutation();

  return (
    <AuthContext.Provider
      value={{
        login: async (username, password) => {
          try {
            const data = await loginMutation({
              username,
              password,
            }).unwrap();
            return data;
          } catch (error) {
            Alert.alert("Error", error?.data?.message, [{ text: "OK" }]);
          }
        },
        register: async (username, password) => {
          try {
            const data = await registerMutation({
              username,
              password,
            });
            // setSession(data?.token);
            return data;
          } catch (error) {
            Alert.alert("Error", error?.data?.message, [{ text: "OK" }]);
          }
        },
        signOut: () => {
          setSession(null);
        },
        session: session,
        isLoading: isLoading || isLoadingLogin || isLoadingRegister,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
