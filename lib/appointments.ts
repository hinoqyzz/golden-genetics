import { addDays, todayISO } from "@/lib/dates";

export const STORAGE_KEY = "gg-appointments-v1";
export const CHANGE_EVENT = "gg-appointments-changed";

export const TIME_SLOTS = ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];
export type AppointmentStatus = "agendada" | "concluida" | "cancelada";

export type Appointment = {
  id: string;
  protocol: string;
  serviceId: string;
  date: string;
  time: string;
  name: string;
  className: string;
  subject: string;
  notes: string;
  status: AppointmentStatus;
  createdAt: string;
};

export type AppointmentDraft = {
  serviceId: string;
  date: string;
  time: string;
  name: string;
  className: string;
  subject: string;
  notes: string;
};

const serviceIds = ["orientacao", "hereditariedade", "edicao", "reproducao"];

function emit() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function createProtocol(existing: string[]) {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const number = Math.floor(1000 + Math.random() * 9000);
    const protocol = `GG-${year}-${number}`;
    if (!existing.includes(protocol)) return protocol;
  }
  return `GG-${year}-${Date.now().toString().slice(-6)}`;
}

function buildSeed(): Appointment[] {
  const today = todayISO();
  const samples: Array<Omit<Appointment, "id" | "protocol" | "createdAt">> = [
    {
      serviceId: "orientacao",
      date: today,
      time: "10:00",
      name: "Helena Costa",
      className: "9º ano A",
      subject: "Diferença entre gene e característica",
      notes: "Visita com a turma da manhã.",
      status: "agendada",
    },
    {
      serviceId: "hereditariedade",
      date: today,
      time: "15:30",
      name: "Pedro Alves",
      className: "1ª série B",
      subject: "Quadro de Punnett",
      notes: "",
      status: "concluida",
    },
    {
      serviceId: "edicao",
      date: addDays(today, 1),
      time: "09:00",
      name: "Júlia Mendes",
      className: "9º ano B",
      subject: "O que o CRISPR faz e o que ele não faz",
      notes: "Quer comparar edição e seleção embrionária.",
      status: "agendada",
    },
    {
      serviceId: "reproducao",
      date: addDays(today, 2),
      time: "11:30",
      name: "Liam Souza",
      className: "2ª série A",
      subject: "Limites dos testes genéticos",
      notes: "",
      status: "agendada",
    },
    {
      serviceId: "orientacao",
      date: addDays(today, 3),
      time: "14:00",
      name: "Ana Beatriz",
      className: "",
      subject: "Cromossomos e pares de bases",
      notes: "Visitante da feira.",
      status: "agendada",
    },
    {
      serviceId: "hereditariedade",
      date: addDays(today, 5),
      time: "10:00",
      name: "Clara Nunes",
      className: "8º ano C",
      subject: "Por que irmãos podem ser diferentes",
      notes: "",
      status: "agendada",
    },
    {
      serviceId: "edicao",
      date: addDays(today, -2),
      time: "14:00",
      name: "Rafael Dias",
      className: "1ª série A",
      subject: "Riscos da edição germinativa",
      notes: "",
      status: "concluida",
    },
    {
      serviceId: "reproducao",
      date: addDays(today, 4),
      time: "17:00",
      name: "Marina Teixeira",
      className: "9º ano A",
      subject: "Ética dos bebês sob medida",
      notes: "Horário cancelado na demonstração.",
      status: "cancelada",
    },
  ];

  return samples.map((sample, index) => ({
    ...sample,
    id: `seed-${index + 1}`,
    protocol: `GG-${new Date().getFullYear()}-${1400 + index}`,
    createdAt: new Date().toISOString(),
  }));
}

export function loadAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    const seed = buildSeed();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    const parsed = JSON.parse(raw) as Appointment[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveAppointments(items: Appointment[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emit();
}

export function slotKey(date: string, time: string) {
  return `${date}|${time}`;
}

export function isSlotTaken(items: Appointment[], date: string, time: string) {
  return items.some(
    (item) => item.date === date && item.time === time && item.status !== "cancelada",
  );
}

export function createAppointment(
  draft: AppointmentDraft,
): { ok: true; appointment: Appointment } | { ok: false; message: string } {
  if (!serviceIds.includes(draft.serviceId)) {
    return { ok: false, message: "Escolha um dos serviços educativos." };
  }
  if (!TIME_SLOTS.includes(draft.time as TimeSlot)) {
    return { ok: false, message: "Escolha um horário da lista." };
  }

  const items = loadAppointments();
  if (isSlotTaken(items, draft.date, draft.time)) {
    return {
      ok: false,
      message: "Esse horário já foi reservado nesta demonstração. Escolha outro.",
    };
  }

  const appointment: Appointment = {
    id: crypto.randomUUID(),
    protocol: createProtocol(items.map((item) => item.protocol)),
    serviceId: draft.serviceId,
    date: draft.date,
    time: draft.time,
    name: draft.name.trim(),
    className: draft.className.trim(),
    subject: draft.subject.trim(),
    notes: draft.notes.trim(),
    status: "agendada",
    createdAt: new Date().toISOString(),
  };

  saveAppointments([...items, appointment]);
  return { ok: true, appointment };
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const items = loadAppointments();
  const current = items.find((item) => item.id === id);
  if (!current) return { ok: false as const, message: "Registro não encontrado." };
  if (status !== "cancelada" && current.status === "cancelada") {
    const conflict = items.some(
      (item) =>
        item.id !== id &&
        item.date === current.date &&
        item.time === current.time &&
        item.status !== "cancelada",
    );
    if (conflict) {
      return {
        ok: false as const,
        message: "Esse horário já está ocupado por outra consulta demonstrativa.",
      };
    }
  }
  saveAppointments(items.map((item) => (item.id === id ? { ...item, status } : item)));
  return { ok: true as const };
}

export function removeAppointment(id: string) {
  saveAppointments(loadAppointments().filter((item) => item.id !== id));
}

export function clearAppointments() {
  saveAppointments([]);
}
