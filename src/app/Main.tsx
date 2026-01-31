import { View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Header } from "../components/Header";

export function Main() {
    const { currentTheme } = useTheme();

    return (
        <View style={{
                flex: 1,
                backgroundColor: currentTheme.background
            }}>
            <Header />      
        </View>
    )
}