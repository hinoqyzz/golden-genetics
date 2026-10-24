"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppointments } from "@/hooks/use-appointments";
import { useClientNow } from "@/hooks/use-client-now";
import {
  clearAppointments,
  removeAppointment,
  updateAppointmentStatus,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/appointments";
import { consultServices, getService } from "@/lib/content";
import { dateTimeStamp, formatLongDate, toISODate } from "@/lib/dates";
import { cn } from "@/lib/utils";

const ServiceChart = dynamic(
  () => import("@/components/admin/service-chart").then((mod) => mod.ServiceChart),
  { ssr: false, loading: () => <div className="mt-4 h-64 rounded-xl bg-[#eef3f8]" /> },
);

const statusLabels: Record<AppointmentStatus, string> = {
  agendada: "Agendada",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

export function AdminDashboard() {
  const { items, ready } = useAppointments();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"todos" | AppointmentStatus>("todos");
  const [message, setMessage] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const nowMs = useClientNow();
  const today = nowMs > 0 ? toISODate(new Date(nowMs)) : "";
  const stamp = (() => {
    if (!nowMs) return "";
    const date = new Date(nowMs);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${toISODate(date)}T${hours}:${minutes}`;
  })();
  const metrics = useMemo(() => {
    const upcoming = items
      .filter((item) => item.status === "agendada" && stamp !== "" && dateTimeStamp(item.date, item.time) > stamp)
      .sort((a, b) => dateTimeStamp(a.date, a.time).localeCompare(dateTimeStamp(b.date, b.time)))
      .slice(0, 4);
    return {
      total: items.length,
      today: items.filter((item) => item.date === today && item.status !== "cancelada").length,
      done: items.filter((item) => item.status === "concluida").length,
      upcoming,
    };
  }, [items, today, stamp]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items
      .filter((item) => (status === "todos" ? true : item.status === status))
      .filter((item) => item.name.toLowerCase().includes(term))
      .sort((a, b) => dateTimeStamp(a.date, a.time).localeCompare(dateTimeStamp(b.date, b.time)));
  }, [items, query, status]);

  const chartData = consultServices.map((service) => ({
    name: service.chartLabel,
    full: service.title,
    total: items.filter((item) => item.serviceId === service.id && item.status !== "cancelada").length,
  }));

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8" aria-hidden>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="h-24 motion-safe:animate-pulse rounded-2xl bg-[#e7eef6]" />
          <div className="h-24 motion-safe:animate-pulse rounded-2xl bg-[#e7eef6]" />
          <div className="h-24 motion-safe:animate-pulse rounded-2xl bg-[#e7eef6]" />
        </div>
        <div className="mt-6 h-72 motion-safe:animate-pulse rounded-2xl bg-[#e7eef6]" />
      </div>
    );
  }

  const changeStatus = (item: Appointment, next: AppointmentStatus) => {
    const result = updateAppointmentStatus(item.id, next);
    setMessage(
      result.ok
        ? `Status de ${item.name} atualizado para ${statusLabels[next].toLowerCase()}.`
        : result.message,
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
      <div className="rounded-2xl border border-line bg-[#f8fbfe] px-4 py-3 text-sm leading-relaxed text-body">
        Painel local de demonstração. Os registros ficam apenas neste navegador. Isto não é um sistema clínico, não tem autenticação e não deve receber dados reais de pacientes.
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Metric label="Total de agendamentos" value={metrics.total} />
        <Metric label="Consultas do dia" value={metrics.today} />
        <Metric label="Consultas concluídas" value={metrics.done} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-lg font-semibold">Serviços mais procurados</h2>
          <p className="mt-1 text-sm text-body">Contagem sem as consultas canceladas.</p>
          {chartData.every((item) => item.total === 0) ? (
            <p className="mt-8 text-sm text-body">Ainda não há consultas para comparar serviços.</p>
          ) : (
            <ServiceChart data={chartData} />
          )}
        </section>
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-lg font-semibold">Próximos horários</h2>
          {metrics.upcoming.length === 0 ? (
            <p className="mt-4 text-sm text-body">Nenhum horário futuro agendado.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {metrics.upcoming.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-body">{getService(item.serviceId)?.chartLabel}</p>
                  </div>
                  <p className="text-right text-body">
                    {formatLongDate(item.date)}
                    <span className="mt-1 block font-mono text-tech">{item.time}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="busca">Buscar por nome</Label>
            <Input id="busca" value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="status">Filtrar por status</Label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value as "todos" | AppointmentStatus)}
              className="mt-2 h-11 rounded-[10px] border border-line bg-white px-3 text-sm"
            >
              <option value="todos">Todos</option>
              <option value="agendada">Agendada</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>
        <p key={message ?? "vazio"} role="status" className="gg-status mt-4 min-h-5 text-sm text-body">
          {message}
        </p>
        {filtered.length === 0 ? (
          <p className="mt-4 text-sm text-body">Nenhuma consulta encontrada para essa busca.</p>
        ) : (
          <div className="mt-2 divide-y divide-line">
            {filtered.map((item) => (
              <article key={item.id} className="grid gap-3 py-4 md:grid-cols-[1.1fr_1fr_0.8fr_0.9fr_auto] md:items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="mt-1 text-sm text-body">{item.className || "Sem turma"} · {item.protocol}</p>
                </div>
                <div className="text-sm">
                  <p>{getService(item.serviceId)?.title}</p>
                  <p className="mt-1 text-body">{item.subject}</p>
                </div>
                <p className="text-sm text-body">
                  {formatLongDate(item.date)}
                  <span className="mt-1 block font-mono text-tech">{item.time}</span>
                </p>
                <div>
                  <label className="sr-only" htmlFor={`status-${item.id}`}>
                    Status de {item.name}
                  </label>
                  <select
                    id={`status-${item.id}`}
                    value={item.status}
                    onChange={(event) => changeStatus(item, event.target.value as AppointmentStatus)}
                    className="h-10 w-full rounded-[10px] border border-line bg-white px-2 text-sm"
                  >
                    <option value="agendada">Agendada</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="secondary" onClick={() => changeStatus(item, "cancelada")} disabled={item.status === "cancelada"}>
                    Cancelar
                  </Button>
                  {pendingDelete === item.id ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        removeAppointment(item.id);
                        setPendingDelete(null);
                        setMessage(`${item.name} foi excluído da demonstração.`);
                      }}
                    >
                      Confirmar exclusão
                    </Button>
                  ) : (
                    <Button type="button" size="sm" variant="danger" onClick={() => setPendingDelete(item.id)}>
                      Excluir
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="mt-6 border-t border-line pt-5">
          {confirmClear ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  clearAppointments();
                  setConfirmClear(false);
                  setMessage("Os dados locais da demonstração foram apagados.");
                }}
              >
                Apagar todos os registros
              </Button>
              <Button type="button" variant="secondary" onClick={() => setConfirmClear(false)}>
                Manter os dados
              </Button>
            </div>
          ) : (
            <Button type="button" variant="danger" onClick={() => setConfirmClear(true)}>
              Limpar os dados da demonstração
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className={cn("rounded-2xl border border-line bg-white px-5 py-4")}>
      <p className="text-sm text-body">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
