import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../contexts/ThemeContext";
import { Reminder, RepeatType, ReminderFormData } from "../types/Reminder";

type Props = {
  reminder: Reminder | null;
  onSave: (data: ReminderFormData) => void;
  onClose: () => void;
};

export function ReminderForm({ reminder, onSave, onClose }: Props) {
  const { currentTheme } = useTheme();
  const [title, setTitle] = useState(reminder?.title ?? "");
  const [description, setDescription] = useState(reminder?.description ?? "");
  const [time, setTime] = useState(reminder?.time ?? "");
  const [repeatType, setRepeatType] = useState<RepeatType>(reminder?.repeatType ?? "once");
  const [interval, setInterval] = useState(reminder?.interval?.toString() ?? "");
  const [date, setDate] = useState(reminder ? new Date(reminder.trigger_at) : new Date());
  const [tags, setTags] = useState<string[]>(reminder?.tags ?? []);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title);
      setDescription(reminder.description ?? "");
      setTime(reminder.time);
      setRepeatType(reminder.repeatType ?? "once");
      setInterval(reminder.interval?.toString() ?? "");
      setDate(new Date(reminder.trigger_at));
      setTags(reminder.tags ?? []);
    } else {
      setTitle("");
      setDescription("");
      setTime("");
      setRepeatType("once");
      setInterval("");
      setDate(new Date());
      setTags([]);
    }
  }, [reminder]);

  function handleDateChange(_: any, selectedDate?: Date) {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  }

  function formatTime(value: string) {
    const numeric = value.replace(/\D/g, "").slice(0, 4);
    if (numeric.length <= 2) return numeric;
    return `${numeric.slice(0, 2)}:${numeric.slice(2)}`;
  }

  function isValidTime(time: string) {
    const [hour, minute] = time.split(":").map(Number);
    return (
      time.length === 5 &&
      hour >= 0 &&
      hour <= 23 &&
      minute >= 0 &&
      minute <= 59
    );
  }

  const isValid =
    title.trim() &&
    isValidTime(time) &&
    repeatType &&
    (repeatType !== "interval" || Number(interval) > 0);

  function handleSave() {
    if (!isValid) return;

    const [hour, minute] = time.split(":").map(Number);
    const trigger_at = new Date(date);
    trigger_at.setHours(hour, minute, 0, 0);

    const data: ReminderFormData = {
      title: title.trim(),
      description: description.trim(),
      date: trigger_at.toISOString().split("T")[0],
      time,
      repeatType,
      interval: repeatType === "interval" ? Number(interval) : undefined,
      enabled: true,
      tags,
      trigger_at: trigger_at.toISOString().split("Z")[0],
    };

    onSave(data);
    onClose();
  }

  return (
    <View style={{ backgroundColor: currentTheme.card, padding: 20, borderRadius: 16 }}>
      <Text style={{ color: currentTheme.text, fontSize: 18, marginBottom: 12 }}>
        {reminder ? "Editar lembrete" : "Novo lembrete"}
      </Text>

      <TextInput
        placeholder="Título *"
        placeholderTextColor={currentTheme.subtext}
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 0.5, borderBottomColor: currentTheme.border, color: currentTheme.text, marginTop: 12 }}
      />

      <TextInput
        placeholder="Descrição (opcional)"
        placeholderTextColor={currentTheme.subtext}
        value={description}
        onChangeText={setDescription}
        style={{ borderBottomWidth: 0.5, borderBottomColor: currentTheme.border, color: currentTheme.text, marginTop: 12 }}
      />

      <TextInput
        placeholder="Horário (HH:MM) *"
        placeholderTextColor={currentTheme.subtext}
        keyboardType="numeric"
        value={time}
        onChangeText={(v) => setTime(formatTime(v))}
        maxLength={5}
        style={{ borderBottomWidth: 0.5, borderBottomColor: currentTheme.border, color: currentTheme.text, marginTop: 12 }}
      />

      <Text style={{ color: currentTheme.subtext, marginTop: 12 }}>Repetição *</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 8 }}>
        {[
          { label: "Não repetir", value: "once" },
          { label: "Diária", value: "daily" },
          { label: "A cada x horas", value: "interval" },
        ].map((opt) => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => setRepeatType(opt.value as RepeatType)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 16,
              backgroundColor: repeatType === opt.value ? currentTheme.primary : currentTheme.card,
              borderWidth: 1,
              borderColor: currentTheme.border,
            }}
          >
            <Text style={{ color: repeatType === opt.value ? "#fff" : currentTheme.subtext }}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {repeatType === "interval" && (
        <TextInput
          placeholder="Intervalo em horas *"
          placeholderTextColor={currentTheme.subtext}
          keyboardType="numeric"
          value={interval}
          onChangeText={setInterval}
          style={{ borderBottomWidth: 0.5, borderBottomColor: currentTheme.border, color: currentTheme.text, marginTop: 12 }}
        />
      )}

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ borderBottomWidth: 0.5, borderBottomColor: currentTheme.border, paddingVertical: 12, marginTop: 12 }}>
        <Text style={{ color: currentTheme.subtext }}>Data: {date.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="calendar" onChange={handleDateChange} />
      )}

      <View style={{ marginTop: 12 }}>
        <Text style={{ color: currentTheme.subtext, marginBottom: 8 }}>Tags</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {tags.map((tag, idx) => (
            <TouchableOpacity key={idx} onPress={() => setTags(tags.filter(t => t !== tag))} style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, backgroundColor: currentTheme.primary }}>
              <Text style={{ color: "#fff" }}>{tag} x</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          placeholder="Adicionar tag e apertar OK (opcional)"
          placeholderTextColor={currentTheme.subtext}
          value={tagInput}
          onChangeText={setTagInput}
          onSubmitEditing={() => {
            if (tagInput.trim() && !tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
            setTagInput("");
          }}
          style={{ borderBottomWidth: 0.5, borderBottomColor: currentTheme.border, color: currentTheme.text, marginTop: 8, paddingVertical: 4 }}
        />
      </View>

      <TouchableOpacity
        onPress={handleSave}
        disabled={!isValid}
        style={{ backgroundColor: isValid ? currentTheme.primary : currentTheme.border, paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 24 }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
        <Text style={{ color: currentTheme.subtext, textAlign: "center" }}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}