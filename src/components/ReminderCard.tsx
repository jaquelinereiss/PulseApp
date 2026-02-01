import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Reminder } from "../types/Reminder";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
  reminder: Reminder;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

export function ReminderCard({ reminder, onPress, onToggle, onDelete }: Props) {
  const { currentTheme } = useTheme();

  function getRepeatLabel() {
    if (reminder.repeatType === "once") return "Não repetir";
    if (reminder.repeatType === "daily") return "Diária";
    if (reminder.repeatType === "interval")
      return `A cada ${reminder.interval}h`;

    return "";
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: currentTheme.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        opacity: reminder.enabled ? 1 : 0.5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <Switch
          value={reminder.enabled}
          onValueChange={onToggle}
          style={{
            marginRight: 12,
          }}
          thumbColor={reminder.enabled ? currentTheme.primary : "#ccc"}
        />

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: currentTheme.text,
              fontSize: 16,
              fontWeight: "600",
              flex: 1,
            }}
          >
            {reminder.title}
          </Text>

          {reminder.description ? (
            <Text style={{ color: currentTheme.subtext, marginTop: 4 }}>
              {reminder.description}
            </Text>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ marginTop: 8 }}>
              <Text style={{ color: currentTheme.primary, fontWeight: "500" }}>
                Data: {new Date(reminder.date).toLocaleDateString()}
              </Text>

              <Text style={{ color: currentTheme.primary, fontWeight: "500" }}>
                Horário: {reminder.time}
              </Text>

              {reminder.tags && reminder.tags.length > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: 4,
                  }}
                >
                  {reminder.tags.map((tag, index) => (
                    <View
                      key={index}
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 12,
                        backgroundColor: currentTheme.border,
                        marginRight: 4,
                        marginBottom: 4,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 12 }}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Ionicons
                name="repeat"
                size={14}
                color={currentTheme.subtext}
                style={{ marginRight: 4 }}
              />

              <Text style={{ color: currentTheme.subtext, fontSize: 13 }}>
                {getRepeatLabel()}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={onDelete}
          style={{
            marginLeft: 12,
            paddingTop: 2,
          }}
        >
          <Ionicons name="trash" size={24} color={currentTheme.subtext} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
