import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";

export async function getDeviceToken(): Promise<string | null> {
  try {

    if (Platform.OS === "ios") {
      await messaging().requestPermission();
    }

    const token = await messaging().getToken();

    console.log("FCM TOKEN:", token);

    return token;

  } catch (error) {
    console.log("Erro ao obter token:", error);
    return null;
  }
}