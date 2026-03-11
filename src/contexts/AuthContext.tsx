import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  userToken: string | null;
  loading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("@pulseapp:token");
        if (token) setUserToken(token);
      } catch (err) {
        console.log("Erro ao carregar token:", err);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const signIn = async (token: string) => {
    try {
      await AsyncStorage.setItem("@pulseapp:token", token);
      setUserToken(token);
    } catch (err) {
      console.log("Erro ao salvar token:", err);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("@pulseapp:token");
      setUserToken(null);
    } catch (err) {
      console.log("Erro ao remover token:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};