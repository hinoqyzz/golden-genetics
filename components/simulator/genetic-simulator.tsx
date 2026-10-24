"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  cross,
  fraction,
  percent,
  phenotypeDistribution,
  traits,
  type Genotype,
  type TraitId,
} from "@/lib/genetics";
import { cn } from "@/lib/utils";

const ProbabilityChart = dynamic(
  () => import("@/components/simulator/probability-chart").then((mod) => mod.ProbabilityChart),
  { ssr: false, loading: () => <div className="mt-3 h-64 rounded-xl bg-[#eef3f8]" /> },
);

const genotypes: Genotype[] = ["AA", "Aa", "aa"];
const presets: Array<{ label: string; parentA: Genotype; parentB: Genotype }> = [
  { label: "AA × Aa", parentA: "AA", parentB: "Aa" },
  { label: "Aa × Aa", parentA: "Aa", parentB: "Aa" },
  { label: "Aa × aa", parentA: "Aa", parentB: "aa" },
];

const barColors: Record<Genotype, string> = {
  AA: "#082F70",
  Aa: "#075CA8",
  aa: "#80B8E4",
};

const eyeColors = {
  castanho: "#6A4428",
  mel: "#B5813A",
  verde: "#3E7A58",
  azul: "#3D76AE",
} as const;

const skinTones = ["#F6D7C8", "#E8C2A8", "#C48A62", "#8D5A3C", "#5C3B2E"] as const;

type Portrait = {
  id: number;
  hair: "liso" | "ondulado" | "cacheado";
  eyes: keyof typeof eyeColors;
  tone: 0 | 1 | 2 | 3 | 4;
};

const complexTraits = [
  {
    title: "Cor dos olhos",
    text: "A cor da íris envolve vários genes, entre eles OCA2 e HERC2. Ela não segue um único par “azul recessivo, castanho dominante”, como alguns livros antigos simplificavam. Dois pais de olhos castanhos podem ter um filho de olhos claros, e o contrário também acontece.",
  },
  {
    title: "Altura",
    text: "A altura é poligênica e muito sensível a nutrição, saúde na infância e sono. Escores usados em pesquisa estimam tendências em populações. Eles não determinam a altura de uma criança e não servem para escolher essa característica.",
  },
  {
    title: "Textura do cabelo",
    text: "A curvatura do fio depende de vários genes ligados ao formato do folículo, e também de fatores que não são herdados. Não é um menu mendeliano com três resultados garantidos.",
  },
];

export function GeneticSimulator() {
  const [traitId, setTraitId] = useState<TraitId>("ervilha");
  const [parentA, setParentA] = useState<Genotype>("Aa");
  const [parentB, setParentB] = useState<Genotype>("Aa");
  const [portrait, setPortrait] = useState<Portrait | null>(null);
  const trait = traits[traitId];
  const result = useMemo(() => cross(parentA, parentB), [parentA, parentB]);
  const phenotypes = useMemo(() => phenotypeDistribution(result, trait), [result, trait]);
  const chartData = genotypes.map((genotype) => ({
    name: genotype,
    valor: Math.round(result.probabilities[genotype] * 100),
  }));

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold tracking-tight">Modelo e genótipos</h2>
          <p className="mt-2 text-sm leading-relaxed text-body">
            O modelo acompanha o exemplo. Assim a ervilha não é calculada com a regra da flor, nem uma característica humana entra na conta.
          </p>
          <div className="mt-5 grid gap-2" role="radiogroup" aria-label="Modelo de herança">
            {(Object.keys(traits) as TraitId[]).map((id) => {
              const item = traits[id];
              const selected = id === traitId;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setTraitId(id)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left",
                    selected ? "border-institutional bg-[#f4f9fd]" : "border-line hover:border-institutional/40",
                  )}
                >
                  <span className="block text-sm font-medium">{item.modelLabel}</span>
                  <span className="mt-1 block text-sm text-body">{item.title}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-body">{trait.summary}</p>
          <div className="mt-5">
            <p className="text-sm font-medium">Exemplos de cruzamento</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  type="button"
                  size="sm"
                  variant={parentA === preset.parentA && parentB === preset.parentB ? "default" : "secondary"}
                  onClick={() => {
                    setParentA(preset.parentA);
                    setParentB(preset.parentB);
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          <GenotypePicker label="Genitor A" value={parentA} onChange={setParentA} />
          <GenotypePicker label="Genitor B" value={parentB} onChange={setParentB} />
          <div className="mt-5 space-y-3 text-sm leading-relaxed text-body">
            <p>{trait.alleleA}</p>
            <p>{trait.alleleB}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6" aria-live="polite">
          <h2 className="text-lg font-semibold tracking-tight">Resultado do cruzamento</h2>
          <p className="mt-2 text-sm leading-relaxed text-body">
            No cruzamento {parentA} × {parentB}, cada genitor contribui com um alelo. As quatro casas do quadro são igualmente possíveis.
          </p>
          <Punnett parentA={result.parentA} parentB={result.parentB} grid={result.grid} />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {genotypes.map((genotype) => (
              <div key={genotype} className="rounded-xl border border-line px-3 py-3">
                <p className="font-mono text-sm text-tech">{genotype}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{percent(result.probabilities[genotype])}</p>
                <p className="mt-1 text-sm text-body">
                  {fraction(result.counts[genotype])} · {trait.phenotypes[genotype]}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-medium">Distribuição dos genótipos</h3>
            <ProbabilityChart data={chartData} />
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-medium">Fenótipo neste modelo</h3>
            <ul className="mt-3 space-y-2">
              {phenotypes.map((item) => (
                <li key={item.label} className="grid grid-cols-[1fr_auto] gap-3 text-sm">
                  <span>{item.label}</span>
                  <span className="font-medium">{percent(item.probability)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-body">
              Genótipo é o par de alelos. Fenótipo é a característica observável nesse modelo. Na dominância completa, AA e Aa podem ter o mesmo fenótipo e, ainda assim, genótipos diferentes. Na dominância incompleta, o heterozigoto tem fenótipo próprio. Nada disso prevê inteligência, altura ou aparência de uma pessoa.
            </p>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-line bg-white p-5 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Características humanas complexas</h2>
        <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-body">
          Cor dos olhos, altura e textura do cabelo não são heranças de um gene só. Este módulo não calcula essas características e não as apresenta como previsão de bebê.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {complexTraits.map((item) => (
            <article key={item.title}>
              <PolygenicMark />
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-line bg-[#f8fbfe] p-5 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Meu bebê hipotético</h2>
        <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-body">
          O botão sorteia um desenho. Ele não usa os genótipos escolhidos acima e não corresponde a uma previsão genética real.
        </p>
        <Button
          type="button"
          className="mt-5"
          onClick={() =>
            setPortrait({
              id: Date.now(),
              hair: pick(["liso", "ondulado", "cacheado"]),
              eyes: pick(["castanho", "mel", "verde", "azul"]),
              tone: pick([0, 1, 2, 3, 4]),
            })
          }
        >
          Gerar ilustração aleatória
        </Button>
        {portrait ? (
          <div key={portrait.id} className="mt-6 grid items-center gap-6 rounded-2xl border border-line bg-white p-5 sm:grid-cols-[180px_1fr]">
            <PortraitDrawing portrait={portrait} />
            <div>
              <p className="text-sm font-medium text-danger">Ilustração aleatória. Não é uma previsão.</p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-muted">Cabelo do desenho</dt>
                  <dd className="mt-1 font-medium capitalize">{portrait.hair}</dd>
                </div>
                <div>
                  <dt className="text-muted">Olhos do desenho</dt>
                  <dd className="mt-1 font-medium capitalize">{portrait.eyes}</dd>
                </div>
                <div>
                  <dt className="text-muted">Origem</dt>
                  <dd className="mt-1 font-medium">Sorteio visual</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-body">
                As cores e a forma existem só neste desenho. Cor dos olhos, cabelo e tom de pele humanos não saem de um quadro de um gene, e este sorteio não consulta gene nenhum.
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-sm text-body">Nenhuma ilustração gerada ainda.</p>
        )}
      </section>
    </div>
  );
}

function GenotypePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Genotype;
  onChange: (genotype: Genotype) => void;
}) {
  return (
    <div className="mt-5">
      <p className="text-sm font-medium" id={`${label}-legend`}>
        {label}
      </p>
      <div className="mt-2 grid grid-cols-3 gap-2" role="group" aria-labelledby={`${label}-legend`}>
        {genotypes.map((genotype) => (
          <button
            key={genotype}
            type="button"
            aria-pressed={value === genotype}
            onClick={() => onChange(genotype)}
            className={cn(
              "rounded-[10px] border py-2 font-mono text-sm",
              value === genotype ? "border-primary bg-primary text-white" : "border-line bg-white",
            )}
          >
            {genotype}
          </button>
        ))}
      </div>
    </div>
  );
}

function Punnett({
  parentA,
  parentB,
  grid,
}: {
  parentA: [string, string];
  parentB: [string, string];
  grid: Genotype[];
}) {
  return (
    <div className="mt-5 overflow-x-auto">
      <table
        key={`${parentA.join("")}-${parentB.join("")}-${grid.join("")}`}
        className="gg-punnett w-full min-w-[280px] border-separate border-spacing-1 text-center text-sm"
      >
        <caption className="mb-2 text-left text-sm font-medium text-foreground">Quadro de Punnett</caption>
        <thead>
          <tr>
            <th className="p-2 text-muted" scope="col">
              <span className="sr-only">Alelos</span>
            </th>
            {parentA.map((allele, index) => (
              <th key={`${allele}-${index}`} scope="col" className="rounded-md bg-[#eef5fb] p-2 font-mono">
                {allele}
                <span className="sr-only"> do genitor A</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[0, 1].map((row) => (
            <tr key={row}>
              <th scope="row" className="rounded-md bg-[#eef5fb] p-2 font-mono">
                {parentB[row]}
                <span className="sr-only"> do genitor B</span>
              </th>
              {[0, 1].map((column) => {
                const genotype = grid[row * 2 + column] ?? "Aa";
                return (
                  <td
                    key={`${row}-${column}`}
                    className={cn(
                      "gg-cell rounded-md p-4 font-mono text-base font-medium",
                      genotype === "aa" ? "text-foreground" : "text-white",
                    )}
                    style={{
                      background: genotype === "aa" ? "#d7ebf8" : barColors[genotype],
                      animationDelay: `${(row * 2 + column) * 70}ms`,
                    }}
                  >
                    {genotype}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PolygenicMark() {
  return (
    <svg viewBox="0 0 220 36" className="h-9 w-full max-w-[220px]" aria-hidden>
      {Array.from({ length: 7 }, (_, index) => (
        <circle key={index} cx={10 + index * 16} cy={18} r="3" fill="#168AD2" opacity={0.35 + (index % 3) * 0.2} />
      ))}
      <path d="M118 18h48" stroke="#80B8E4" strokeWidth="1.5" />
      <rect x="168" y="8" width="46" height="20" rx="6" fill="none" stroke="#075CA8" />
    </svg>
  );
}

function PortraitDrawing({ portrait }: { portrait: Portrait }) {
  const skin = skinTones[portrait.tone];
  const eye = eyeColors[portrait.eyes];
  return (
    <svg viewBox="0 0 180 200" role="img" aria-label="Desenho abstrato sorteado, sem valor de previsão" className="h-auto w-full">
      <rect width="180" height="200" rx="20" fill="#F5F8FC" />
      {portrait.hair === "cacheado" ? (
        <g fill="#082F70">
          <circle cx="90" cy="78" r="18" />
          <circle cx="62" cy="96" r="16" />
          <circle cx="118" cy="96" r="16" />
          <circle cx="74" cy="70" r="14" />
          <circle cx="108" cy="68" r="14" />
        </g>
      ) : null}
      {portrait.hair === "ondulado" ? (
        <path d="M48 108c6-48 20-62 42-66 24-4 40 16 46 66" fill="#075CA8" />
      ) : null}
      {portrait.hair === "liso" ? <path d="M58 112c4-52 18-70 32-72 22-2 36 22 38 72" fill="#082F70" /> : null}
      <circle cx="90" cy="112" r="40" fill={skin} />
      <circle cx="76" cy="110" r="3.5" fill={eye} />
      <circle cx="104" cy="110" r="3.5" fill={eye} />
      <path d="M82 126c6 6 14 6 20 0" fill="none" stroke="#12243A" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

function pick<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)] as T;
}
