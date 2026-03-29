import { registerRootComponent } from 'expo';
import App from './src/App';
import messaging from "@react-native-firebase/messaging";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log("Mensagem recebida em background:", remoteMessage);
});

registerRootComponent(App);