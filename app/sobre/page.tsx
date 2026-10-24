import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "A Golden Genetics é um laboratório fictício de divulgação científica criado para uma feira de ciências.",
};

export default function SobrePage() {
  return (
    <>
      <PageIntro
        title="Explorando o código da vida."
        lede="Um laboratório de feira para demonstrar genética, discutir biotecnologia e debater, com cuidado, a ideia de bebês sob medida."
      />
      <AboutPage />
    </>
  );
}
