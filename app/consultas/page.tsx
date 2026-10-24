import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = {
  title: "Consultas",
  description:
    "Agendamento fictício de conversas educativas sobre genética. Os horários ficam salvos apenas neste navegador.",
};

export default function ConsultasPage() {
  return (
    <>
      <div className="no-print">
        <PageIntro
          title="Agendar uma consulta demonstrativa"
          lede="Escolha um tema, um dia e um horário. A conversa é educativa e não pede dados de saúde. O registro funciona somente no dispositivo usado na demonstração."
        />
      </div>
      <BookingWizard />
    </>
  );
}
