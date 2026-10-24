"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function syncScrollPosition() {
  if (typeof window === "undefined") return;
  const hash = window.location.hash;
  if (hash.length > 1) {
    const target = document.querySelector(hash);
    if (target instanceof HTMLElement) {
      if (instance) instance.scrollTo(target, { offset: -88, immediate: true });
      else target.scrollIntoView();
    }
    return;
  }
  if (instance) {
    instance.scrollTo(0, { immediate: true });
    return;
  }
  window.scrollTo(0, 0);
}
