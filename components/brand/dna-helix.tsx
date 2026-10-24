"use client";

import { memo, useEffect, useRef } from "react";

const SVG_NS = "http://www.w3.org/2000/svg";
const STEPS = 48;
const RUNGS = 12;

type Segment = SVGLineElement;

export const DnaHelix = memo(function DnaHelix() {
  const layerRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const strands: Segment[] = [];
    const rungs: Segment[] = [];

    const create = () => {
      layer.replaceChildren();
      strands.length = 0;
      rungs.length = 0;
      for (let index = 0; index < STEPS * 2; index += 1) {
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("stroke-linecap", "round");
        layer.appendChild(line);
        strands.push(line);
      }
      for (let index = 0; index < RUNGS; index += 1) {
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("stroke", "#80B8E4");
        line.setAttribute("stroke-linecap", "round");
        layer.appendChild(line);
        rungs.push(line);
      }
    };

    create();

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let phase = 0.7;
    let frame = 0;

    const draw = () => {
      if (layer.childElementCount === 0) create();
      const cx = 160;
      const top = 98;
      const height = 188;
      const radius = 44;
      const pointsA: Array<{ x: number; y: number; z: number }> = [];
      const pointsB: Array<{ x: number; y: number; z: number }> = [];

      for (let index = 0; index <= STEPS; index += 1) {
        const progress = index / STEPS;
        const angle = phase + progress * Math.PI * 2 * 2.05;
        const y = top + progress * height;
        pointsA.push({
          x: cx + Math.sin(angle) * radius,
          y,
          z: Math.cos(angle),
        });
        pointsB.push({
          x: cx + Math.sin(angle + Math.PI) * radius,
          y,
          z: Math.cos(angle + Math.PI),
        });
      }

      const pieces: Array<{ z: number; node: Segment; x1: number; y1: number; x2: number; y2: number; stroke: string; width: number; opacity: number }> = [];

      for (let index = 0; index < STEPS; index += 1) {
        const startA = pointsA[index];
        const endA = pointsA[index + 1];
        const startB = pointsB[index];
        const endB = pointsB[index + 1];
        if (!startA || !endA || !startB || !endB) continue;
        const nodeA = strands[index];
        const nodeB = strands[STEPS + index];
        if (!nodeA || !nodeB) continue;
        pieces.push({
          z: (startA.z + endA.z) / 2,
          node: nodeA,
          x1: startA.x,
          y1: startA.y,
          x2: endA.x,
          y2: endA.y,
          stroke: "#082F70",
          width: 2.2 + ((startA.z + 1) / 2) * 3.4,
          opacity: 0.45 + ((startA.z + 1) / 2) * 0.55,
        });
        pieces.push({
          z: (startB.z + endB.z) / 2,
          node: nodeB,
          x1: startB.x,
          y1: startB.y,
          x2: endB.x,
          y2: endB.y,
          stroke: "#168AD2",
          width: 2.2 + ((startB.z + 1) / 2) * 3.4,
          opacity: 0.4 + ((startB.z + 1) / 2) * 0.6,
        });
      }

      pieces.sort((left, right) => left.z - right.z);
      for (const piece of pieces) {
        piece.node.setAttribute("x1", piece.x1.toFixed(2));
        piece.node.setAttribute("y1", piece.y1.toFixed(2));
        piece.node.setAttribute("x2", piece.x2.toFixed(2));
        piece.node.setAttribute("y2", piece.y2.toFixed(2));
        piece.node.setAttribute("stroke", piece.stroke);
        piece.node.setAttribute("stroke-width", piece.width.toFixed(2));
        piece.node.setAttribute("opacity", piece.opacity.toFixed(2));
        layer.appendChild(piece.node);
      }

      for (let index = 0; index < RUNGS; index += 1) {
        const step = Math.round((index + 0.5) * (STEPS / RUNGS));
        const left = pointsA[step];
        const right = pointsB[step];
        const rung = rungs[index];
        if (!left || !right || !rung) continue;
        const depth = (left.z + 1) / 2;
        rung.setAttribute("x1", left.x.toFixed(2));
        rung.setAttribute("y1", left.y.toFixed(2));
        rung.setAttribute("x2", right.x.toFixed(2));
        rung.setAttribute("y2", right.y.toFixed(2));
        rung.setAttribute("stroke-width", (1 + depth * 1.5).toFixed(2));
        rung.setAttribute("opacity", (0.28 + depth * 0.55).toFixed(2));
        layer.appendChild(rung);
      }
    };

    draw();
    if (media.matches) return () => layer.replaceChildren();

    const loop = () => {
      phase += 0.01;
      draw();
      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(frame);
      layer.replaceChildren();
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      <svg viewBox="0 0 320 390" className="h-auto w-full" role="img" aria-label="Dupla hélice de DNA em rotação lenta, dentro de um aro azul">
        <defs>
          <radialGradient id="gg-stage" cx="50%" cy="52%" r="58%">
            <stop offset="0%" stopColor="#f7fbfe" />
            <stop offset="72%" stopColor="#eef5fb" />
            <stop offset="100%" stopColor="#f5f8fc" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="214" r="138" fill="url(#gg-stage)" />
        <circle cx="160" cy="214" r="138" fill="none" stroke="#80B8E4" strokeWidth="1.4" />
        <circle cx="160" cy="214" r="150" fill="none" stroke="#168AD2" strokeWidth="1" opacity="0.35" strokeDasharray="2 8" />
        <g fill="#168AD2">
          <circle cx="36" cy="86" r="1.5" opacity="0.28" />
          <circle cx="286" cy="104" r="1.3" opacity="0.22" />
          <circle cx="298" cy="250" r="1.6" opacity="0.2" />
          <circle cx="24" cy="268" r="1.2" opacity="0.26" />
          <circle cx="250" cy="46" r="1.15" opacity="0.22" />
        </g>
        <path d="M142 58h36a5 5 0 0 1 5 5v34h-46V63a5 5 0 0 1 5-5z" fill="none" stroke="#075CA8" strokeWidth="2.4" />
        <path d="M136 54h48" stroke="#082F70" strokeWidth="3.2" strokeLinecap="round" />
        <g ref={layerRef} />
      </svg>
    </div>
  );
});
