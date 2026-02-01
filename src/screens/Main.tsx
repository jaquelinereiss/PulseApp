import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Header } from "../components/Header";
import { ReminderModal } from "../components/ReminderModal";
import { Reminder } from "../types/Reminder";
import { Ionicons } from "@expo/vector-icons";
import { ReminderCard } from "../components/ReminderCard";
import { saveReminders, loadReminders } from "../services/storage";

export function Main() {
  const { currentTheme } = useTheme();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

  useEffect(() => {
    async function fetchReminders() {
      const saved = await loadReminders();
      setReminders(saved);
    }
    fetchReminders();
  }, []);

  function handleSaveReminder(data: Omit<Reminder, "id" | "enabled">) {
    let updated: Reminder[];

    if (selectedReminder) {
      updated = reminders.map((item) =>
        item.id === selectedReminder.id ? { ...item, ...data } : item
      );
    } else {
      updated = [
        ...reminders,
        {
          id: String(Date.now()),
          ...data,
          enabled: true,
        },
      ];
    }

    setReminders(updated);
    saveReminders(updated);
    setSelectedReminder(null);
  }

  function handleToggleReminder(id: string) {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    setReminders(updated);
    saveReminders(updated);
  }

  function handleDeleteReminder(id: string, title: string) {
    Alert.alert(
      "Excluir lembrete",
      `Deseja excluir o lembrete "${title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            const updated = reminders.filter((item) => item.id !== id);
            setReminders(updated);
            saveReminders(updated);
          },
        },
      ],
      { cancelable: true }
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
        <Text style={{ textAlign: "center", color: currentTheme.subtext, marginTop: 24 }}>
          Nenhum lembrete criado até o momento.
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
            onToggle={() => handleToggleReminder(item.id)}
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
