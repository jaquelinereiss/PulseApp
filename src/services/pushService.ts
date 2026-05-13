import messaging from "@react-native-firebase/messaging";
import { Platform, PermissionsAndroid } from "react-native";

async function requestPermissionAndroid() {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  }

  return true;
}

export async function getDeviceToken(): Promise<string | null> {
  try {
    const hasPermission = await requestPermissionAndroid();

    console.log("Permissão:", hasPermission);

    if (!hasPermission) { return null;}

    const token = await messaging().getToken();

    console.log("📱 FCM TOKEN:");
    console.log(token);

    return token;
  } catch (error) {
    
    console.log("Erro ao obter token:", error);

    return null;
  }
}