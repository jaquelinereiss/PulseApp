import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

export function Header() {
    const { currentTheme, toggleTheme, theme } = useTheme();

    return(
        <View style={{
                height: 80,
                backgroundColor: currentTheme.background,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingTop: 40
            }}>
            <Text style={{ color: currentTheme.text,
                fontSize: 18, fontWeight: "600"
            }}>
                Pulse
            </Text>

            <TouchableOpacity onPress={toggleTheme}>
                <Ionicons
                    name={theme === "light" ? "moon" : "sunny"}
                    size={22}
                    color={currentTheme.text}>
                </Ionicons>
            </TouchableOpacity>
        </View>
    )
}