import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Header } from "../components/Header";
import { ReminderModal } from "../components/ReminderModal";
import { Reminder } from "../types/Reminder";
import { Ionicons } from "@expo/vector-icons";
import { ReminderCard } from "../components/ReminderCard";

export function Main() {
  const { currentTheme } = useTheme();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(
    null,
  );

  function handleSaveReminder(data: Omit<Reminder, "id" | "enabled">) {
    if (selectedReminder) {
      setReminders((prev) =>
        prev.map((item) =>
          item.id === selectedReminder.id ? { ...item, ...data } : item,
        ),
      );
    } else {
      setReminders((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          ...data,
          enabled: true,
        },
      ]);
    }

    setSelectedReminder(null);
  }

  function handleDeleteReminder(id: string, title: string) {
    Alert.alert(
      "Excluir lembrete",
      `Deseja excluir o lembrete "${title}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setReminders((prev) => prev.filter((item) => item.id !== id));
          },
        },
      ],
      { cancelable: true },
    );
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
          marginVertical: 16,
        }}
      >
        <Ionicons name="add-circle" size={28} color={currentTheme.primary} />
      </TouchableOpacity>

      {reminders.length === 0 && (
        <Text
          style={{
            textAlign: "center",
            color: currentTheme.subtext,
            marginTop: 24,
          }}
        >
          Nenhuma notificação criada ainda
        </Text>
      )}

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReminderCard
            reminder={item}
            onPress={() => {
              setSelectedReminder(item);
              setModalVisible(true);
            }}
            onToggle={() => {
              setReminders((prev) =>
                prev.map((r) =>
                  r.id === item.id ? { ...r, enabled: !r.enabled } : r,
                ),
              );
            }}
            onDelete={() => handleDeleteReminder(item.id, item.title)}
          />
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
