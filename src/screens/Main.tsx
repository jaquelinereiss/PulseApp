import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, TextStyle } from "react-native";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Header } from "../components/Header";
import { ReminderModal } from "../components/ReminderModal";
import { Reminder } from "../types/Reminder";
import { Ionicons } from "@expo/vector-icons";
import { ReminderCard } from "../components/ReminderCard";
import { saveReminders, loadReminders } from "../services/storage";
import DateTimePicker from "@react-native-community/datetimepicker";

export function Main() {
  
  const { currentTheme } = useTheme();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEnabled, setFilterEnabled] = useState<null | boolean>(null);
  const [filterRepeat, setFilterRepeat] = useState<null | "once" | "daily" | "interval">(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        item.id === selectedReminder.id ? { ...item, ...data } : item,
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
      r.id === id ? { ...r, enabled: !r.enabled } : r,
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
      { cancelable: true },
    );
  }

  const filteredReminders = reminders.filter((r) => {
    if (
      searchQuery &&
      !r.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

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

  function filterButtomStyle(active: boolean) {
    return {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 16,
      backgroundColor: active ? currentTheme.primary : currentTheme.card,
    };
  }

  function filterButtonText(active: boolean) {
    return {
      color: active ? "#fff" : currentTheme.subtext,
      fontSize: 13,
    };
  }

  const allTags = Array.from(new Set(reminders.flatMap((r) => r.tags ?? [])));

  function tagStyle(active: boolean) {
    return {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
      backgroundColor: active ? currentTheme.primary + "22" : currentTheme.card,
      borderWidth: 1,
      borderColor: active ? currentTheme.primary : currentTheme.border,
    };
  }

  function tagTextStyle(active: boolean): TextStyle {
    return {
      color: active ? currentTheme.primary : currentTheme.subtext,
      fontSize: 12,
      fontWeight: active ? "600" : "400",
    };
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
          style={{
            flex: 1,
            color: currentTheme.text,
            paddingVertical: 6,
          }}
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close"
              size={18}
              color={currentTheme.subtext}
              style={{
                margin: 10,
              }}
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
          <TouchableOpacity onPress={() => {
            setFilterDate(null);
            setShowDatePicker(false);
          }}>
            <Ionicons name="close" size={18} color={currentTheme.subtext}
            style={{
                margin: 10,
              }} />
          </TouchableOpacity>
        )}
      </View>

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
          style={filterButtomStyle(filterEnabled === true)}
        >
          <Text style={filterButtonText(filterEnabled === true)}>Ativados</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setFilterEnabled(filterEnabled === false ? null : false)
          }
          style={filterButtomStyle(filterEnabled === false)}
        >
          <Text style={filterButtonText(filterEnabled === false)}>
            Desativados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setFilterRepeat(filterRepeat === "once" ? null : "once")
          }
          style={filterButtomStyle(filterRepeat === "once")}
        >
          <Text style={filterButtonText(filterRepeat === "once")}>
            Não repetir
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setFilterRepeat(filterRepeat === "daily" ? null : "daily")
          }
          style={filterButtomStyle(filterRepeat === "daily")}
        >
          <Text style={filterButtonText(filterRepeat === "daily")}>Diária</Text>
        </TouchableOpacity>
      </View>

      {allTags.length > 0 && (
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
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

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
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
            if (selectedDate) {
              setFilterDate(selectedDate);
            }
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
