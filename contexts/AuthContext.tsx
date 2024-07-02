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

            if (data?.token) {
              setSession(data?.token);
              return true;
            }
            console.error("token has not been delivered :/");
            return false;
          } catch (error) {
            Alert.alert("Error", error?.data?.message, [{ text: "OK" }]);
            return false;
          }
        },
        register: async (username, password) => {
          try {
            const data = await registerMutation({
              username,
              password,
            }).unwrap();
            Alert.alert("Success", data?.message, [{ text: "OK" }]);
            return true;
          } catch (error) {
            Alert.alert("Error", error?.data?.errors[0].msg, [{ text: "OK" }]);
            return false;
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
