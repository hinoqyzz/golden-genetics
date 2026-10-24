"use client";

import { useSyncExternalStore } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = { name: string; full: string; total: number };

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ServiceChart({ data }: { data: Point[] }) {
  const animate = useSyncExternalStore(subscribe, motionAllowed, () => true);

  return (
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(8,47,112,0.08)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#5A6C80", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: "#5A6C80", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value, _name, item) => [`${value ?? 0} consultas`, String(item?.payload?.full ?? "")]} />
          <Bar dataKey="total" fill="#075CA8" radius={[6, 6, 0, 0]} isAnimationActive={animate} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
