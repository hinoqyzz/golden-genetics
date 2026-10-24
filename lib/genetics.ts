export type Allele = "A" | "a";
export type Genotype = "AA" | "Aa" | "aa";
export type InheritanceModel = "completa" | "incompleta";
export type TraitId = "ervilha" | "flor" | "abstrato";

export type TraitModel = {
  id: TraitId;
  model: InheritanceModel;
  modelLabel: string;
  title: string;
  summary: string;
  alleleA: string;
  alleleB: string;
  phenotypes: Record<Genotype, string>;
};

export const GENOTYPES: Genotype[] = ["AA", "Aa", "aa"];

export const traits: Record<TraitId, TraitModel> = {
  ervilha: {
    id: "ervilha",
    model: "completa",
    modelLabel: "Dominância completa",
    title: "Ervilha de Mendel — textura da semente",
    summary:
      "No experimento clássico de Mendel, a semente lisa é dominante sobre a semente rugosa. Uma cópia do alelo A já produz semente lisa. Este exemplo não descreve características humanas.",
    alleleA:
      "A é o alelo associado à semente lisa. Na dominância completa, o genótipo Aa tem o mesmo fenótipo de AA.",
    alleleB:
      "a é o alelo associado à semente rugosa. O fenótipo rugoso aparece apenas no genótipo aa.",
    phenotypes: {
      AA: "Semente lisa",
      Aa: "Semente lisa",
      aa: "Semente rugosa",
    },
  },
  flor: {
    id: "flor",
    model: "incompleta",
    modelLabel: "Dominância incompleta",
    title: "Boca-de-leão — cor da flor",
    summary:
      "Na boca-de-leão, a cor da flor é um exemplo clássico de dominância incompleta. O heterozigoto não repete um dos homozigotos: ele tem cor intermediária. As letras A e a aqui são apenas rótulos dos dois alelos.",
    alleleA: "A, neste exemplo, contribui para pigmento vermelho.",
    alleleB:
      "a, neste exemplo, não produz esse pigmento. Juntos, A e a produzem flor rosa — um fenótipo próprio.",
    phenotypes: {
      AA: "Flor vermelha",
      Aa: "Flor rosa",
      aa: "Flor branca",
    },
  },
  abstrato: {
    id: "abstrato",
    model: "completa",
    modelLabel: "Dominância completa",
    title: "Modelo abstrato de um único gene",
    summary:
      "Um modelo sem espécie e sem característica humana. Serve para ver a conta. Dominante, aqui, não significa melhor, mais comum ou mais forte.",
    alleleA: "A representa o alelo dominante deste modelo didático.",
    alleleB: "a representa o alelo recessivo. O fenótipo recessivo só aparece em aa.",
    phenotypes: {
      AA: "Fenótipo dominante",
      Aa: "Fenótipo dominante",
      aa: "Fenótipo recessivo",
    },
  },
};

export type CrossResult = {
  parentA: [Allele, Allele];
  parentB: [Allele, Allele];
  grid: Genotype[];
  counts: Record<Genotype, number>;
  probabilities: Record<Genotype, number>;
};

export function allelesOf(genotype: Genotype): [Allele, Allele] {
  if (genotype === "AA") return ["A", "A"];
  if (genotype === "aa") return ["a", "a"];
  return ["A", "a"];
}

export function combine(left: Allele, right: Allele): Genotype {
  if (left === "A" && right === "A") return "AA";
  if (left === "a" && right === "a") return "aa";
  return "Aa";
}

export function cross(parentA: Genotype, parentB: Genotype): CrossResult {
  const a = allelesOf(parentA);
  const b = allelesOf(parentB);
  const grid = [
    combine(a[0], b[0]),
    combine(a[1], b[0]),
    combine(a[0], b[1]),
    combine(a[1], b[1]),
  ];
  const counts: Record<Genotype, number> = { AA: 0, Aa: 0, aa: 0 };
  for (const genotype of grid) counts[genotype] += 1;
  const probabilities = {
    AA: counts.AA / 4,
    Aa: counts.Aa / 4,
    aa: counts.aa / 4,
  };
  return { parentA: a, parentB: b, grid, counts, probabilities };
}

export type PhenotypeSlice = {
  label: string;
  count: number;
  probability: number;
};

export function phenotypeDistribution(
  result: CrossResult,
  trait: TraitModel,
): PhenotypeSlice[] {
  const buckets = new Map<string, number>();
  for (const genotype of GENOTYPES) {
    const label = trait.phenotypes[genotype];
    buckets.set(label, (buckets.get(label) ?? 0) + result.counts[genotype]);
  }
  return [...buckets.entries()].map(([label, count]) => ({
    label,
    count,
    probability: count / 4,
  }));
}

export function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function fraction(count: number) {
  if (count === 0) return "0";
  if (count === 4) return "4/4";
  if (count === 2) return "2/4";
  if (count === 1) return "1/4";
  if (count === 3) return "3/4";
  return `${count}/4`;
}
