export type RepeatType = 'once' | 'daily' | 'interval';

export type Reminder = {
    id: string;
    title: string;
    description: string;
    time: string;
    interval?: number;
    repeatType: RepeatType;
    enabled: boolean;
}