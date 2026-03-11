import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { login as apiLogin } from "../services/reminderApi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function LoginScreen() {
  const { currentTheme } = useTheme();
  const { signIn } = useAuth();
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password)
      return Alert.alert("Erro", "Preencha email e senha");

    setLoading(true);
    try {
      const token = await apiLogin(email, password);
      await AsyncStorage.setItem("@pulseapp:token", token);
      await signIn(token);

      navigation.navigate("Main");
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Falha ao logar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.title, { color: currentTheme.text }]}>Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={currentTheme.subtext}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[
          styles.input,
          { color: currentTheme.text, borderColor: currentTheme.border },
        ]}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor={currentTheme.subtext}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[
          styles.input,
          { color: currentTheme.text, borderColor: currentTheme.border },
        ]}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: currentTheme.primary }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
