import { Modal, View } from "react-native";
import { Reminder } from "../types/Reminder";
import { ReminderForm } from "./ReminderForm";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
  visible: boolean;
  reminder: Reminder | null;
  onSave: (data: Omit<Reminder, "id">) => void;
  onClose: () => void;
};

export function ReminderModal({ visible, reminder, onSave, onClose }: Props) {
  const { currentTheme } = useTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", padding: 20 }}>
        <View style={{ backgroundColor: currentTheme.card, padding: 20, borderRadius: 16 }}>
          <ReminderForm
            reminder={reminder}
            onSave={(data) => {
              onSave(data);
              onClose();
            }}
            onClose={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}
