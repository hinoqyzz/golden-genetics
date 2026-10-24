"use client";

import { useSyncExternalStore } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Genotype } from "@/lib/genetics";

const barColors: Record<Genotype, string> = {
  AA: "#082F70",
  Aa: "#075CA8",
  aa: "#80B8E4",
};

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ProbabilityChart({ data }: { data: Array<{ name: string; valor: number }> }) {
  const animate = useSyncExternalStore(subscribe, motionAllowed, () => true);

  return (
    <div className="mt-3 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(8,47,112,0.08)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#5A6C80", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#5A6C80", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip formatter={(value) => [`${value ?? 0}%`, "Probabilidade"]} cursor={{ fill: "rgba(8,47,112,0.04)" }} />
          <Bar dataKey="valor" radius={[6, 6, 0, 0]} isAnimationActive={animate}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={barColors[entry.name as Genotype]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
