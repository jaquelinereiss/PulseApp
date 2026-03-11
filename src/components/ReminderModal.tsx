import React from "react";
import { Modal, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { ReminderForm } from "./ReminderForm";
import { Reminder, ReminderFormData } from "../types/Reminder";

type Props = {
  visible: boolean;
  reminder: Reminder | null;
  onSave: (data: ReminderFormData) => void;
  onClose: () => void;
};

export function ReminderModal({ visible, reminder, onSave, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, justifyContent: "center", padding: 16, backgroundColor: "rgba(0,0,0,0.4)" }}>
          <ReminderForm reminder={reminder} onSave={onSave} onClose={onClose} />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}