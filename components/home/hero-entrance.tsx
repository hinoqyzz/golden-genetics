"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ensureGsap, prefersReducedMotion } from "@/lib/animations/gsap";
import { PRELOADER_EVENT } from "@/components/Preloader";

ensureGsap();

const EASE = "power3.out";

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function introArmed() {
  return document.documentElement.classList.contains("gg-intro") && !prefersReducedMotion();
}

export function HeroEntrance({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const armed = useSyncExternalStore(subscribe, introArmed, () => false);
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const start = () => setGo(true);
    window.addEventListener(PRELOADER_EVENT, start);
    return () => window.removeEventListener(PRELOADER_EVENT, start);
  }, [armed]);

  useGSAP(
    () => {
      if (!ref.current || !armed) return;
      if (!go) {
        gsap.set(ref.current, { autoAlpha: 0, y: 16 });
        return;
      }
      gsap.to(ref.current, { autoAlpha: 1, y: 0, duration: 0.72, delay, ease: EASE });
    },
    { dependencies: [armed, go, delay], scope: ref, revertOnUpdate: true },
  );

  return <div ref={ref}>{children}</div>;
}
