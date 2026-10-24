"use client";

import { useSyncExternalStore } from "react";

let cached = 0;

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 60_000);
  return () => window.clearInterval(id);
}

function getSnapshot() {
  const next = Date.now();
  if (!cached || Math.floor(next / 60_000) !== Math.floor(cached / 60_000)) {
    cached = next;
  }
  return cached;
}

export function useClientNow() {
  return useSyncExternalStore(subscribe, getSnapshot, () => 0);
}
