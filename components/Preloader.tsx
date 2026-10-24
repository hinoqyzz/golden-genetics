"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { ensureGsap, prefersReducedMotion } from "@/lib/animations/gsap";

export const PRELOADER_KEY = "gg-preloader-seen";
export const PRELOADER_EVENT = "gg-intro-complete";

ensureGsap();

function subscribe() {
  return () => {};
}

function readBoot(pathname: string) {
  if (pathname !== "/") return "skip";
  try {
    return sessionStorage.getItem(PRELOADER_KEY) === "1" ? "skip" : "play";
  } catch {
    return "skip";
  }
}

function releasePage() {
  document.documentElement.classList.remove("gg-intro", "gg-intro-live");
  document.body.style.overflow = "";
  for (const node of [
    document.querySelector("header"),
    document.getElementById("conteudo"),
    document.querySelector("footer"),
    document.querySelector(".skip-link"),
  ]) {
    node?.removeAttribute("inert");
  }
}

function lockPage() {
  document.documentElement.classList.add("gg-intro", "gg-intro-live");
  document.body.style.overflow = "hidden";
  for (const node of [
    document.querySelector("header"),
    document.getElementById("conteudo"),
    document.querySelector("footer"),
    document.querySelector(".skip-link"),
  ]) {
    node?.setAttribute("inert", "");
  }
}

function whenLoaded() {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

function whenLogoReady() {
  const image = new window.Image();
  image.src = "/branding/logo-mark.png";
  if (image.complete) return Promise.resolve();
  return new Promise<void>((resolve) => {
    image.onload = () => resolve();
    image.onerror = () => resolve();
  });
}

function rememberVisit() {
  try {
    sessionStorage.setItem(PRELOADER_KEY, "1");
  } catch {
    /* sessão indisponível */
  }
}

export function Preloader() {
  const pathname = usePathname();
  const boot = useSyncExternalStore(subscribe, () => readBoot(pathname), () => "pending");
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const playing = boot === "play" && !finished;
      if (boot === "skip" && pathname !== "/") rememberVisit();
      if (!playing || !rootRef.current) return;

      const root = rootRef.current;
      let cancel = false;
      lockPage();

      const tasks = [document.fonts.ready.then(() => undefined), whenLogoReady(), whenLoaded()];
      let done = 0;
      const resourcesReady = { current: false };
      const ready = Promise.all(
        tasks.map((task) =>
          task.then(() => {
            done += 1;
            if (!cancel) setProgress(Math.round((done / tasks.length) * 100));
            if (done === tasks.length) resourcesReady.current = true;
          }),
        ),
      );

      const finish = () => {
        if (cancel) return;
        rememberVisit();
        root.style.visibility = "hidden";
        releasePage();
        const heading = document.querySelector("#conteudo h1");
        if (heading instanceof HTMLElement) {
          heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
        }
        setFinished(true);
      };

      if (prefersReducedMotion()) {
        void ready.then(() => {
          if (cancel) return;
          setProgress(100);
          finish();
        });
        return () => {
          cancel = true;
          releasePage();
        };
      }

      const ring = root.querySelector<SVGCircleElement>(".gg-ring");
      const length = ring?.getTotalLength() ?? 0;
      if (ring) {
        gsap.set(ring, { strokeDasharray: length, strokeDashoffset: length });
      }
      gsap.set(".gg-line-lab, .gg-line-name, .gg-line-grade", { y: 16 });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline.fromTo(".gg-stroke", { attr: { rx: 1, ry: 0.4 }, opacity: 1 }, { attr: { rx: 70, ry: 0.5 }, duration: 0.42 }, 0);
      timeline.to(".gg-stroke", { attr: { rx: 74, ry: 74 }, duration: 0.7, ease: "power2.inOut" }, 0.38);
      timeline.to(".gg-stroke", { opacity: 0, duration: 0.25 }, 0.95);
      if (ring) {
        timeline.to(ring, { strokeDashoffset: 0, duration: 0.85, ease: "power2.out" }, 0.42);
      }
      timeline.to(".gg-mark", { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, duration: 0.65 }, 0.85);
      timeline.fromTo(".gg-glow", { opacity: 0 }, { opacity: 0.85, duration: 0.35 }, 0.9);
      timeline.to(".gg-glow", { opacity: 0.28, duration: 0.5 }, 1.25);
      timeline.to(".gg-line-lab", { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.5 }, 1.15);
      timeline.to(".gg-line-name", { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.55 }, 1.32);
      timeline.to(".gg-line-grade", { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.5 }, 1.52);

      let leaving = false;
      const leave = () => {
        if (cancel || leaving || !resourcesReady.current || timeline.progress() < 1) return;
        leaving = true;
        setProgress(100);
        window.dispatchEvent(new Event(PRELOADER_EVENT));
        const exit = gsap.timeline({ onComplete: finish });
        exit.to(".gg-intro-body", { autoAlpha: 0, y: -28, duration: 0.48, ease: "power2.in" }, 0);
        exit.to(root, { clipPath: "inset(100% 0% 0% 0%)", duration: 0.72, ease: "power3.inOut" }, 0.04);
      };

      timeline.eventCallback("onComplete", leave);
      void ready.then(() => {
        if (cancel) return;
        resourcesReady.current = true;
        setProgress(100);
        if (timeline.progress() < 1) timeline.timeScale(1.65);
        leave();
      });

      return () => {
        cancel = true;
        releasePage();
      };
    },
    { dependencies: [activeKey(boot, finished, pathname)], scope: rootRef },
  );

  if (!activeKey(boot, finished, pathname).startsWith("play")) return null;

  const percent = progress >= 100 ? "100%" : `${String(progress).padStart(2, "0")}%`;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[80] overflow-hidden bg-[#F6F9FE]" role="presentation">
      <p className="sr-only" role="status">
        Preparando a experiência do Laboratório Golden Genetics.
      </p>
      <div className="gg-intro-body flex h-full flex-col items-center justify-center px-6">
        <div className="relative grid h-52 w-52 place-items-center sm:h-60 sm:w-60">
          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
            <ellipse className="gg-stroke" cx="100" cy="100" rx="1" ry="0.4" fill="none" stroke="#1688DA" strokeWidth="0.8" />
            <circle className="gg-ring" cx="100" cy="100" r="74" fill="none" stroke="#086DB7" strokeWidth="0.9" strokeLinecap="round" />
          </svg>
          <div className="gg-mark relative h-[92px] w-[92px] opacity-0 sm:h-[108px] sm:w-[108px]" style={{ clipPath: "inset(0% 0% 100% 0%)" }}>
            <div
              className="gg-glow pointer-events-none absolute -inset-6 rounded-full opacity-0"
              style={{ background: "radial-gradient(circle, rgba(22,136,218,0.35), transparent 68%)" }}
              aria-hidden
            />
            <Image src="/branding/logo-mark.png" alt="" width={176} height={176} priority className="relative h-full w-full" />
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center text-center">
          <p className="gg-line-lab text-[11px] font-medium tracking-[0.42em] text-[#086DB7] opacity-0 sm:text-xs" style={{ clipPath: "inset(0% 0% 100% 0%)" }}>
            LABORATÓRIO
          </p>
          <p className="gg-line-name mt-3 text-[1.85rem] leading-none font-semibold tracking-[-0.045em] text-[#092C67] opacity-0 sm:text-6xl" style={{ clipPath: "inset(0% 0% 100% 0%)" }}>
            GOLDEN GENETICS
          </p>
          <p className="gg-line-grade mt-4 text-[11px] font-medium tracking-[0.22em] text-[#086DB7] opacity-0 sm:text-xs sm:tracking-[0.28em]" style={{ clipPath: "inset(0% 0% 100% 0%)" }}>
            3º ANO ENSINO MÉDIO
          </p>
        </div>
      </div>
      <div className="gg-intro-body absolute right-0 bottom-[max(1.75rem,env(safe-area-inset-bottom))] left-0 px-6" aria-hidden>
        <div className="mx-auto flex w-full max-w-[280px] items-center gap-3">
          <div className="h-px flex-1 bg-[#092C67]/12">
            <div className="h-px origin-left bg-[#086DB7]" style={{ transform: `scaleX(${progress / 100})` }} />
          </div>
          <span className="w-10 font-mono text-[11px] tracking-[0.14em] text-[#086DB7] tabular-nums">{percent}</span>
        </div>
        <p className="mt-3 text-center text-[10px] tracking-[0.32em] text-[#086DB7]/75">PREPARANDO EXPERIÊNCIA</p>
      </div>
    </div>
  );
}

function activeKey(boot: string, finished: boolean, pathname: string) {
  if (finished || boot !== "play") return `skip:${pathname}`;
  return "play";
}
