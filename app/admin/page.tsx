import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = {
  title: "Painel da feira",
  description:
    "Painel local para acompanhar os agendamentos demonstrativos salvos neste navegador.",
};

export default function AdminPage() {
  return (
    <>
      <PageIntro
        title="Painel da feira"
        lede="A equipe acompanha aqui os horários marcados neste navegador. Não há senha porque isto não é um sistema seguro para dados de pacientes."
      />
      <AdminDashboard />
    </>
  );
}
