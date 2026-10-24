"use client";

import { useMemo, useSyncExternalStore } from "react";
import { CHANGE_EVENT, loadAppointments, type Appointment } from "@/lib/appointments";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot() {
  return JSON.stringify(loadAppointments());
}

function getServerSnapshot() {
  return "";
}

export function useAppointments() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = useMemo(() => {
    if (!raw) return [] as Appointment[];
    try {
      const parsed = JSON.parse(raw) as Appointment[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [raw]);

  return { items, ready: raw !== "" };
}
