import { View, Text, Button } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export function Main() {
    const { currentTheme, toggleTheme  } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme.background, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{ color: currentTheme.text, fontSize: 20, marginBottom: 16}}>
                Pulse App
            </Text> 
            
          <Button title="Trocar tema" onPress={toggleTheme}></Button> 
        </View>
    )
}