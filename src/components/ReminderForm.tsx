import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Reminder, RepeatType } from "../types/Reminder";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
  reminder: Reminder | null;
  onSave: (data: Omit<Reminder, "id">) => void;
  onClose: () => void;
};

export function ReminderForm({ reminder, onSave, onClose }: Props) {
  const { currentTheme } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [repeatType, setRepeatType] = useState<RepeatType | null>(null);
  const [interval, setInterval] = useState("");

  function formatTime(value: string) {
    const numeric = value.replace(/\D/g, "").slice(0, 4);

    if (numeric.length <= 2) {
      return numeric;
    }

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

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title);
      setDescription(reminder.description);
      setTime(reminder.time);
      setRepeatType(reminder.repeatType);
      setInterval(reminder.interval?.toString() ?? "");
    } else {
      setTitle("");
      setDescription("");
      setTime("");
      setRepeatType(null);
      setInterval("");
    }
  }, [reminder]);

  const isValid =
    title.trim() &&
    isValidTime(time) &&
    repeatType &&
    (repeatType !== "interval" || Number(interval) > 0);

  function handleSave() {
    if (!isValid) return;

    onSave({
      title,
      description,
      time,
      repeatType,
      interval: repeatType === "interval" ? Number(interval) : undefined,
    });

    onClose();
  }

  return (
    <View style={{ backgroundColor: currentTheme.card, padding: 20, borderRadius: 16 }}>
      
      <Text style={{ color: currentTheme.text, fontSize: 18, marginBottom: 12 }}>
        {reminder ? "Editar notificação" : "Nova notificação"}
      </Text>

      <TextInput
        placeholder="Título *"
        placeholderTextColor={currentTheme.subtext}
        value={title}
        onChangeText={setTitle}
        style={{
          borderBottomWidth: 0.5,
          borderBottomColor: currentTheme.border,
          color: currentTheme.text,
          marginTop: 12
        }}
      />

      <TextInput
        placeholder="Descrição (opicional)"
        placeholderTextColor={currentTheme.subtext}
        value={description}
        onChangeText={setDescription}
        style={{
          borderBottomWidth: 0.5,
          borderBottomColor: currentTheme.border,
          color: currentTheme.text,
          marginTop: 12
        }}
      />

      <TextInput
        placeholder="Horário (HH:MM) *"
        placeholderTextColor={currentTheme.subtext}
        keyboardType="numeric"
        value={time}
        onChangeText={(value) => setTime(formatTime(value))}
        maxLength={5}
        style={{
          borderBottomWidth: 0.5,
          borderBottomColor: currentTheme.border,
          color: currentTheme.text,
          marginTop: 12
        }}
      />

      <View>
        <Text style={{ color: currentTheme.subtext, marginTop: 12, marginBottom: 12 }}>
          Repetição *
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, }}>
          {[
            { label: "Não repetir", value: "once" },
            { label: "Diária", value: "daily" },
            { label: "A cada x horas", value: "interval" },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setRepeatType(option.value as RepeatType)}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 16,
                backgroundColor:
                  repeatType === option.value
                    ? currentTheme.primary
                    : currentTheme.card,
                borderWidth: 1,
                borderColor: currentTheme.border
              }}
            >
              <Text style={{ color: repeatType === option.value ? "#fff" : currentTheme.text }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {repeatType === "interval" && (
        <TextInput
          placeholder="Intervalo em horas *"
          placeholderTextColor={currentTheme.subtext}
          keyboardType="numeric"
          value={interval}
          onChangeText={setInterval}
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: currentTheme.border,
            color: currentTheme.text,
            marginTop: 12,
            marginBottom: 8
          }}
        />
      )}

      <TouchableOpacity
        onPress={handleSave}
        disabled={!isValid}
        style={{
          backgroundColor: isValid ? currentTheme.primary : currentTheme.border,
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 24
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
            Salvar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
        <Text style={{ color: currentTheme.subtext, textAlign: "center" }}>
          Cancelar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
