export type RepeatType = "once" | "daily" | "interval";

export type Reminder = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  repeatType?: RepeatType;
  interval?: number;
  enabled: boolean;
  tags?: string[];
  trigger_at: string;
  created_at: string;
  updated_at: string;
  last_triggered_at?: string | null;
};

export type ReminderFormData = {
  title: string;
  description?: string;
  date: string;
  time: string;
  repeatType: RepeatType;
  interval?: number;
  enabled: boolean;
  tags?: string[];
  trigger_at: string;
};
