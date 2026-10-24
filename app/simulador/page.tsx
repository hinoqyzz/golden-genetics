import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/page-intro";
import { GeneticSimulator } from "@/components/simulator/genetic-simulator";

export const metadata: Metadata = {
  title: "Simulação genética",
  description:
    "Simulador educativo de cruzamentos de um gene, com quadro de Punnett e probabilidades reais do modelo escolhido.",
};

export default function SimuladorPage() {
  return (
    <>
      <PageIntro
        title="Simulação genética"
        lede="Um painel didático de um único gene. As probabilidades são calculadas de verdade para o modelo escolhido. Elas não preveem um bebê nem características humanas complexas."
      />
      <GeneticSimulator />
    </>
  );
}
