"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ensureGsap, prefersReducedMotion } from "@/lib/animations/gsap";
import { motionTokens } from "@/lib/animations/motion-tokens";
import { syncScrollPosition } from "@/lib/animations/scroll";

ensureGsap();

export function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      syncScrollPosition();
      if (!ref.current || prefersReducedMotion()) return;
      gsap.fromTo(
        ref.current,
        { autoAlpha: 0, y: motionTokens.pageY },
        {
          autoAlpha: 1,
          y: 0,
          duration: motionTokens.pageDuration,
          ease: "power2.out",
          clearProps: "opacity,visibility,transform",
        },
      );
    },
    { dependencies: [pathname], scope: ref, revertOnUpdate: true },
  );

  return <div ref={ref}>{children}</div>;
}
