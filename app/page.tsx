import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";

export const metadata: Metadata = {
  title: { absolute: "Golden Genetics — Laboratório" },
  description:
    "Explore hereditariedade, edição genética e o debate sobre bebês sob medida em um laboratório fictício feito para uma feira de ciências.",
};

export default function Page() {
  return <HomePage />;
}
