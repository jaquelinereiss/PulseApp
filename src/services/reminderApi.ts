import { Reminder } from "../types/Reminder";
import { API_URL } from "../../config";

export type LoginResponse = {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
};

export async function registerDevice(
  deviceToken: string,
  userToken: string
) {

  const response = await fetch(`${API_URL}/devices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`
    },
    body: JSON.stringify({
      device_token: deviceToken
    })
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Erro ao registrar dispositivo");
  }

}

export async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Falha ao logar");

  return data.access_token;
}

async function request(path: string, token: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Erro ${res.status}`);
  }

  return res.json().catch(() => ({}));
}

function normalizeReminder(r: any): Reminder {
  const trigger = new Date(r.trigger_at);
  const hours = String(trigger.getHours()).padStart(2, "0");
  const minutes = String(trigger.getMinutes()).padStart(2, "0");

  const year = trigger.getFullYear();
  const month = String(trigger.getMonth() + 1).padStart(2, "0");
  const day = String(trigger.getDate()).padStart(2, "0");

  return {
    id: String(r.id),
    user_id: r.user_id ?? "",
    title: r.title,
    description: r.description ?? "",
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
    repeatType: r.recurrence ?? "once",
    interval: r.recurrence?.startsWith("every") ? Number(r.recurrence.replace(/\D/g, "")) : undefined,
    tags: r.tags ?? [],
    enabled: Boolean(r.is_active),
    trigger_at: r.trigger_at,
    created_at: r.created_at ?? new Date().toISOString(),
    updated_at: r.updated_at ?? new Date().toISOString(),
  };
}

export async function getReminders(token: string): Promise<Reminder[]> {
  const data = await request("/reminders", token);
  return data.map(normalizeReminder);
}

export async function createReminder(token: string, data: any): Promise<Reminder> {
  const res = await request("/reminders", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return normalizeReminder(res);
}

export async function updateReminder(token: string, id: string, data: any): Promise<Reminder> {
  const res = await request(`/reminders/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return normalizeReminder(res);
}

export async function toggleReminder(token: string, id: string, enabled: boolean): Promise<Reminder> {
  const res = await request(`/reminders/${id}/active`, token, {
    method: "PATCH",
    body: JSON.stringify({ is_active: enabled }),
  });
  return normalizeReminder(res);
}

export async function deleteReminder(token: string, id: string) {
  await request(`/reminders/${id}`, token, { method: "DELETE" });
}