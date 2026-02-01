import AsyncStorage from "@react-native-async-storage/async-storage";
import { Reminder } from "../types/Reminder";

const STORAGE_KEY = '@pulse_reminders'

export const saveReminders = async (reminders: Reminder[]) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    } catch (e) {
        console.error('Erro ao salvar lembretes:', e)
    }
};

export const loadReminders = async (): Promise<Reminder[]> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];

    } catch (e) {
        console.error('Erro ao carregar lembretes:', e)
        return []
    } 
};