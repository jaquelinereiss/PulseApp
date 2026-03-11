import React from "react";
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

function getRepeatLabel(reminder: Reminder) {
  switch (reminder.repeatType) {
    case "once":
      return "Não repetir";
    case "daily":
      return "Diária";
    case "interval":
      return reminder.interval ? `A cada ${reminder.interval}h` : "Não repetir";
    default:
      return "Não repetir";
  }
}

export function ReminderCard({ reminder, onPress, onToggle, onDelete }: Props) {
  const { currentTheme } = useTheme();
  const tags = reminder.tags ?? [];

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
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <Switch
          value={reminder.enabled}
          onValueChange={onToggle}
          style={{ marginRight: 12 }}
          thumbColor={reminder.enabled ? currentTheme.primary : "#ccc"}
        />

        <View style={{ flex: 1 }}>
          <Text style={{ color: currentTheme.text, fontSize: 16, fontWeight: "600" }}>
            {reminder.title}
          </Text>
          {reminder.description && (
            <Text style={{ color: currentTheme.subtext, marginTop: 4 }}>
              {reminder.description}
            </Text>
          )}

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
            <View>
              <Text style={{ color: currentTheme.primary, fontWeight: "500" }}>
                Data: {new Date(reminder.trigger_at).toLocaleDateString()}
              </Text>
              <Text style={{ color: currentTheme.primary, fontWeight: "500" }}>
                Horário: {new Date(reminder.trigger_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>

              {tags.length > 0 && (
                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
                  {tags.map((tag, idx) => (
                    <View
                      key={idx}
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 12,
                        backgroundColor: currentTheme.primary,
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

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="repeat"
                size={14}
                color={currentTheme.subtext}
                style={{ marginRight: 4 }}
              />
              <Text style={{ color: currentTheme.subtext, fontSize: 13 }}>
                {getRepeatLabel(reminder)}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={onDelete} style={{ marginLeft: 12, paddingTop: 2 }}>
          <Ionicons name="trash" size={24} color={currentTheme.subtext} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
