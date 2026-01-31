import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Header } from "../components/Header";
import { ReminderModal } from "../components/ReminderModal";
import { Reminder } from "../types/Reminder";
import { Ionicons } from "@expo/vector-icons";

export function Main() {
  const { currentTheme } = useTheme();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(
    null,
  );

  function handleSaveReminder(data: Omit<Reminder, "id">) {
    if (selectedReminder) {
      setReminders((prev) =>
        prev.map((item) =>
          item.id === selectedReminder.id ? { ...item, ...data } : item,
        ),
      );
    } else {
      setReminders((prev) => [...prev, { id: String(Date.now()), ...data }]);
    }

    setSelectedReminder(null);
  }

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
      <Header />

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 16
        }}
      >
        <Ionicons name="add-circle" size={28} color={currentTheme.primary} />
      </TouchableOpacity>

      {reminders.length === 0 && (
        <Text style={{ textAlign: "center", color: currentTheme.subtext, marginTop: 24 }}>
          Nenhuma notificação criada ainda
        </Text>
      )}

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedReminder(item);
              setModalVisible(true);
            }}
            style={{
              backgroundColor: currentTheme.card,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12
            }}
          >
            <Text
              style={{
                color: currentTheme.text,
                fontSize: 16,
                fontWeight: "600",
                textAlign: "left"
              }}
            >
              {item.title}
            </Text>

            <Text
              style={{
                color: currentTheme.subtext,
                marginTop: 4,
                textAlign: "left"
              }}
            >
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
      />

      <ReminderModal
        visible={modalVisible}
        reminder={selectedReminder}
        onSave={handleSaveReminder}
        onClose={() => {
          setModalVisible(false);
          setSelectedReminder(null);
        }}
      />
    </View>
  );
}
