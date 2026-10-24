import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/page-intro";
import { ServicesPage } from "@/components/services/services-page";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Explicações educativas sobre DNA, hereditariedade, CRISPR-Cas9, genética reprodutiva e bioética.",
};

export default function ServicosPage() {
  return (
    <>
      <PageIntro
        title="O que este laboratório explica"
        lede="Textos de divulgação científica para a feira. Nenhum descreve um exame, um tratamento ou um serviço clínico real da Golden Genetics."
      />
      <ServicesPage />
    </>
  );
}
