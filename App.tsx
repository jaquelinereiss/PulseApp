import { ThemeProvider } from "./src/contexts/ThemeContext";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Main } from "./src/screens/Main";
import { LoginScreen } from "./src/screens/LoginScreen";
import { View, ActivityIndicator } from "react-native";

const Stack = createNativeStackNavigator();

function Routes() {
  const { userToken, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <Stack.Screen name="Main" component={Main} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}