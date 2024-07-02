import { AuthContext } from "@/contexts/AuthContext";
import React from "react";

export function useAuthContext() {
    return React.useContext(AuthContext);  
  }