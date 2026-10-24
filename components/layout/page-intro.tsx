import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";

export function PageIntro({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children?: ReactNode;
}) {
  return (
    <header className="mx-auto max-w-6xl px-5 pt-12 pb-2 sm:px-8 sm:pt-16">
      <Reveal>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-[66ch] text-lg leading-relaxed text-body">{lede}</p>
      </Reveal>
      {children}
    </header>
  );
}
