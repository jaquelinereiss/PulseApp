// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_URL } from "../config/api";

// export async function login(email: string, password: string) {
//   try {
//     const response = await fetch(`${API_URL}/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const text = await response.text();
//     const data = JSON.parse(text);

//     if (!response.ok) {
//       throw new Error(data.error || "Erro ao fazer login");
//     }

//     await AsyncStorage.setItem("@pulseapp:token", data.access_token);

//     return data.access_token;

//   } catch (error) {
//     console.log("ERRO:", error);
//     throw error;
//   }
// }