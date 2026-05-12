import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, TextStyle } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { getReminders, createReminder, updateReminder, toggleReminder, deleteReminder } from "../services/reminderApi";
import { useNavigation } from "@react-navigation/native";
import { Header } from "../components/Header";
import { ReminderModal } from "../components/ReminderModal";
import { ReminderCard } from "../components/ReminderCard";
import { Reminder, RepeatType, ReminderFormData } from "../types/Reminder";
import { getDeviceToken } from "../services/pushService";
import { registerDevice } from "../services/reminderApi";

function normalizeReminder(r: any, fallbackTags?: string[]): Reminder {
  const triggerDate = new Date(r.trigger_at);

  return {
    id: String(r.id),
    user_id: r.user_id ?? "",
    title: r.title,
    description: r.description ?? "",
    date: triggerDate.toISOString().split("T")[0],
    time: triggerDate.toTimeString().slice(0, 5),
    repeatType: r.repeat_type ?? "once",
    interval: r.interval && Number(r.interval) > 0 ? Number(r.interval) : undefined,
    tags: Array.isArray(r.tags)
      ? r.tags
      : typeof r.tags === "string"
      ? JSON.parse(r.tags)
      : fallbackTags ?? [],
    enabled: Boolean(r.is_active),
    trigger_at: triggerDate.toISOString(),
    created_at: r.created_at ?? new Date().toISOString(),
    updated_at: r.updated_at ?? new Date().toISOString(),
  };
}

export function Main() {
  const { currentTheme } = useTheme();
  const { userToken, loading, signOut } = useAuth();
  const navigation = useNavigation();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEnabled, setFilterEnabled] = useState<null | boolean>(null);
  const [filterRepeat, setFilterRepeat] = useState<null | RepeatType>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!loading && !userToken) navigation.navigate("Login" as never);
  }, [userToken, loading]);

  useEffect(() => {

  async function setupPush() {

  if (!userToken) return;

  try {

    const deviceToken = await getDeviceToken();

    if (!deviceToken) return;

    await registerDevice(deviceToken, userToken);

  } catch (error) {
    console.log("Erro ao registrar device:", error);
  }
}

  setupPush();

}, [userToken]);

  useEffect(() => {
    if (!userToken) return;

    async function fetchReminders() {
      if (!userToken) return;

      try {
        const data = await getReminders(userToken);
        setReminders(data);
      } catch (err: any) {
        Alert.alert("Erro", err.message || "Falha ao carregar lembretes");
        signOut();
      }
    }

    fetchReminders();
  }, [userToken]);

  const handleSaveReminder = useCallback(
  async (data: ReminderFormData) => {
    if (!userToken) return;

    try {
      let saved: any;

      const payload = {
        ...data,
        repeat_type: data.repeatType,
        interval: data.repeatType === "interval" ? data.interval : null,
        tags: JSON.stringify(data.tags),
        trigger_at: new Date(data.trigger_at).toISOString(),
      };

      if (selectedReminder) {
        saved = await updateReminder(userToken, selectedReminder.id, payload);
      } else {
        saved = await createReminder(userToken, payload);
      }

      const normalized = normalizeReminder(saved, data.tags);

      setReminders((prev) =>
        selectedReminder
          ? prev.map((r) => (r.id === normalized.id ? normalized : r))
          : [normalized, ...prev]
      );

      setSelectedReminder(null);
      setModalVisible(false);
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Falha ao salvar lembrete");
    }
  },
  [userToken, selectedReminder]
);

  const handleToggleReminder = useCallback(
    async (id: string) => {
      const reminder = reminders.find((r) => r.id === id);
      if (!reminder) return;

      const newState = !reminder.enabled;
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, enabled: newState } : r)),
      );

      try {
        await toggleReminder(userToken!, id, newState);
      } catch (err: any) {
        Alert.alert("Erro", err.message || "Falha ao atualizar lembrete");
        setReminders((prev) => prev.map((r) => (r.id === id ? reminder : r)));
      }
    },
    [reminders, userToken],
  );

  const handleDeleteReminder = useCallback(
    (id: string, title: string) => {
      Alert.alert("Excluir lembrete", `Deseja excluir o lembrete "${title}"?`, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const removed = reminders.find((r) => r.id === id);
            setReminders((prev) => prev.filter((r) => r.id !== id));
            try {
              await deleteReminder(userToken!, id);
            } catch (err: any) {
              Alert.alert("Erro", err.message || "Falha ao deletar lembrete");

              if (removed) setReminders((prev) => [removed, ...prev]);
            }
          },
        },
      ]);
    },
    [reminders, userToken],
  );

  const filteredReminders = reminders.filter((r) => {
    if (
      searchQuery &&
      !r.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (filterEnabled !== null && r.enabled !== filterEnabled) return false;
    if (filterRepeat && r.repeatType !== filterRepeat) return false;
    if (filterDate) {
      const rDate = new Date(r.date);
      if (
        rDate.getFullYear() !== filterDate.getFullYear() ||
        rDate.getMonth() !== filterDate.getMonth() ||
        rDate.getDate() !== filterDate.getDate()
      )
        return false;
    }
    if (filterTag && !r.tags?.includes(filterTag)) return false;
    return true;
  });

  const allTags = Array.from(new Set(reminders.flatMap((r) => r.tags ?? [])));

  const filterButtonStyle = (active: boolean) => ({
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: active ? currentTheme.primary : currentTheme.card,
  });

  const filterButtonText = (active: boolean) => ({
    color: active ? "#fff" : currentTheme.subtext,
    fontSize: 13,
  });

  const tagStyle = (active: boolean) => ({
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: active ? currentTheme.primary + "22" : currentTheme.card,
    borderWidth: 1,
    borderColor: active ? currentTheme.primary : currentTheme.border,
  });

  const tagTextStyle = (active: boolean): TextStyle => ({
    color: active ? currentTheme.primary : currentTheme.subtext,
    fontSize: 12,
    fontWeight: active ? "600" : "400",
  });

  return (
    <View
      style={{ flex: 1, backgroundColor: currentTheme.background, padding: 15 }}
    >
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
          Nenhum lembrete criado até o momento.
        </Text>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 16,
          marginBottom: 12,
          borderBottomWidth: 0.8,
          borderBottomColor: currentTheme.border,
        }}
      >
        <Ionicons
          name="search"
          size={22}
          color={currentTheme.subtext}
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Buscar lembrete por título..."
          placeholderTextColor={currentTheme.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ flex: 1, color: currentTheme.text, paddingVertical: 6 }}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close"
              size={18}
              color={currentTheme.subtext}
              style={{ margin: 10 }}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Ionicons
            name="calendar-outline"
            size={22}
            color={filterDate ? currentTheme.primary : currentTheme.subtext}
          />
        </TouchableOpacity>
        {filterDate && (
          <TouchableOpacity
            onPress={() => {
              setFilterDate(null);
              setShowDatePicker(false);
            }}
          >
            <Ionicons
              name="close"
              size={18}
              color={currentTheme.subtext}
              style={{ margin: 10 }}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros e tags */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 16,
          marginBottom: 8,
          gap: 8,
        }}
      >
        <TouchableOpacity
          onPress={() => setFilterEnabled(filterEnabled === true ? null : true)}
          style={filterButtonStyle(filterEnabled === true)}
        >
          <Text style={filterButtonText(filterEnabled === true)}>Ativados</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setFilterEnabled(filterEnabled === false ? null : false)
          }
          style={filterButtonStyle(filterEnabled === false)}
        >
          <Text style={filterButtonText(filterEnabled === false)}>
            Desativados
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setFilterRepeat(filterRepeat === "once" ? null : "once")
          }
          style={filterButtonStyle(filterRepeat === "once")}
        >
          <Text style={filterButtonText(filterRepeat === "once")}>
            Não repetir
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setFilterRepeat(filterRepeat === "daily" ? null : "daily")
          }
          style={filterButtonStyle(filterRepeat === "daily")}
        >
          <Text style={filterButtonText(filterRepeat === "daily")}>Diária</Text>
        </TouchableOpacity>
      </View>

      {allTags.length > 0 && (
        <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            <Ionicons
              name="pricetag-outline"
              size={15}
              color={currentTheme.subtext}
            />
            <Text
              style={{
                fontSize: 12,
                color: currentTheme.subtext,
                marginBottom: 6,
              }}
            >
              Filtrar por tag:
            </Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {allTags.map((tag) => {
              const active = filterTag === tag;
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => setFilterTag(active ? null : tag)}
                  style={tagStyle(active)}
                >
                  <Text style={tagTextStyle(active)}>{tag}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={filterDate ?? new Date()}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setFilterDate(selectedDate);
          }}
        />
      )}

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={filteredReminders}
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
