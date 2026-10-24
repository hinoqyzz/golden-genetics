"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppointments } from "@/hooks/use-appointments";
import { useClientNow } from "@/hooks/use-client-now";
import {
  createAppointment,
  isSlotTaken,
  TIME_SLOTS,
  type Appointment,
} from "@/lib/appointments";
import { consultServices, getService } from "@/lib/content";
import {
  formatLongDate,
  formatMonth,
  isPastDate,
  isPastSlot,
  shiftMonth,
  toISODate,
} from "@/lib/dates";
import { identificationSchema, type IdentificationValues } from "@/lib/schema";
import { cn } from "@/lib/utils";

const steps = ["Serviço", "Data e horário", "Identificação", "Confirmação"] as const;
const weekdays = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];

export function BookingWizard() {
  const { items, ready } = useAppointments();
  const nowMs = useClientNow();
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [cursor, setCursor] = useState<Date | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [created, setCreated] = useState<Appointment | null>(null);

  const form = useForm<IdentificationValues>({
    resolver: zodResolver(identificationSchema),
    defaultValues: { name: "", className: "", subject: "", notes: "" },
  });

  const taken = useMemo(
    () =>
      new Set(
        items
          .filter((item) => item.status !== "cancelada")
          .map((item) => `${item.date}|${item.time}`),
      ),
    [items],
  );

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8" aria-hidden>
        <div className="h-14 motion-safe:animate-pulse rounded-xl bg-[#e7eef6]" />
        <div className="mt-6 h-80 motion-safe:animate-pulse rounded-2xl bg-[#e7eef6]" />
      </div>
    );
  }

  const service = serviceId ? getService(serviceId) : undefined;
  const anchor = nowMs > 0 ? new Date(nowMs) : null;
  if (anchor && cursor === null) setCursor(anchor);
  const minMonth = anchor ? new Date(anchor.getFullYear(), anchor.getMonth(), 1) : new Date(2026, 0, 1);
  const maxMonth = shiftMonth(minMonth, 8);

  const reset = () => {
    setStep(1);
    setServiceId(null);
    setDate(null);
    setTime(null);
    setSlotError(null);
    setCreated(null);
    form.reset();
  };

  const goToSchedule = () => {
    if (!serviceId) {
      setSlotError("Escolha um serviço para continuar.");
      return;
    }
    setSlotError(null);
    setStep(2);
  };

  const goToIdentity = () => {
    if (!date || !time) {
      setSlotError("Escolha uma data e um horário.");
      return;
    }
    if (isPastSlot(date, time) || isSlotTaken(items, date, time)) {
      setSlotError("Esse horário não está mais disponível. Escolha outro.");
      return;
    }
    setSlotError(null);
    setStep(3);
  };

  const onSubmit = form.handleSubmit((values) => {
    if (!serviceId || !date || !time) return;
    const result = createAppointment({
      serviceId,
      date,
      time,
      name: values.name,
      className: values.className,
      subject: values.subject,
      notes: values.notes,
    });
    if (!result.ok) {
      setSlotError(result.message);
      return;
    }
    setSlotError(null);
    setCreated(result.appointment);
    setStep(4);
  });

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div>
        <ol className="no-print grid grid-cols-4 gap-2" aria-label="Etapas do agendamento">
          {steps.map((label, index) => {
            const number = index + 1;
            const current = number === step;
            const done = number < step && step < 4;
            return (
              <li key={label}>
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => setStep(number)}
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "flex h-full w-full flex-col items-start rounded-[10px] border px-2 py-2 text-left sm:px-3",
                    current ? "border-primary bg-primary text-white" : "border-line bg-white text-body",
                    done && "hover:border-institutional",
                  )}
                >
                  <span className="font-mono text-xs">{String(number).padStart(2, "0")}</span>
                  <span className="mt-1 text-[11px] leading-tight font-medium sm:text-sm">{label}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <p className="no-print mt-4 text-sm leading-relaxed text-body">
          O agendamento é fictício e fica salvo somente neste dispositivo. Limpar os dados do navegador apaga os horários.
        </p>

        {slotError ? (
          <p role="alert" className="no-print mt-4 rounded-[10px] border border-[#e4c8cc] bg-[#fdf6f7] px-3 py-2 text-sm text-danger">
            {slotError}
          </p>
        ) : null}

        <div key={step} className="gg-step mt-6">
            {step === 1 ? (
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Escolher serviço</h2>
                <div role="radiogroup" aria-label="Serviço educativo" className="mt-5 grid gap-3">
                  {consultServices.map((item) => {
                    const selected = serviceId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => {
                          setServiceId(item.id);
                          setSlotError(null);
                        }}
                        className={cn(
                          "rounded-2xl border bg-white p-5 text-left transition-colors",
                          selected ? "border-institutional bg-[#f4f9fd]" : "border-line hover:border-institutional/40",
                        )}
                      >
                        <span className="flex items-start justify-between gap-4">
                          <span className="text-lg font-semibold tracking-tight">{item.title}</span>
                          <span className="shrink-0 font-mono text-xs text-tech">{item.duration}</span>
                        </span>
                        <span className="mt-2 block text-sm leading-relaxed text-body">{item.description}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="no-print mt-6 flex justify-end">
                  <Button type="button" onClick={goToSchedule}>
                    Continuar
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Escolher data e horário</h2>
                <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
                  {cursor ? (
                  <MonthCalendar
                    cursor={cursor}
                    today={anchor ? toISODate(anchor) : ""}
                    selected={date}
                    minMonth={minMonth}
                    maxMonth={maxMonth}
                    onCursor={setCursor}
                    onSelect={(iso) => {
                      setDate(iso);
                      setTime(null);
                      setSlotError(null);
                    }}
                  />
                ) : (
                  <div className="h-80 rounded-2xl bg-[#e7eef6]" aria-hidden />
                )}
                  <div>
                    <p className="text-sm font-medium" id="horarios-label">
                      Horários
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-labelledby="horarios-label">
                      {TIME_SLOTS.map((slot) => {
                        const disabled = !date || isPastSlot(date, slot) || taken.has(`${date}|${slot}`);
                        const selected = time === slot;
                        const reason = !date
                          ? "Escolha uma data primeiro"
                          : isPastSlot(date, slot)
                            ? "Horário encerrado"
                            : taken.has(`${date}|${slot}`)
                              ? "Ocupado"
                              : "Disponível";
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={disabled}
                            aria-pressed={selected}
                            onClick={() => {
                              setTime(slot);
                              setSlotError(null);
                            }}
                            className={cn(
                              "rounded-[10px] border px-3 py-3 text-sm transition-colors duration-200",
                              selected ? "border-primary bg-primary text-white" : "border-line bg-white",
                              disabled && "cursor-not-allowed opacity-45",
                            )}
                          >
                            <span className="block font-medium">{slot}</span>
                            <span className="mt-1 block text-xs">{selected ? "Selecionado" : reason}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="no-print mt-6 flex justify-between gap-3">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                    Voltar
                  </Button>
                  <Button type="button" onClick={goToIdentity}>
                    Continuar
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <form onSubmit={onSubmit} noValidate>
                <h2 className="text-2xl font-semibold tracking-tight">Identificação</h2>
                <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-body">
                  Use apenas um nome ou apelido. Não escreva CPF, prontuário, histórico médico, DNA ou outro dado sensível.
                </p>
                <div className="mt-5 grid gap-5">
                  <div>
                    <Label htmlFor="name">Nome ou apelido</Label>
                    <Input
                      id="name"
                      autoComplete="nickname"
                      className="mt-2"
                      aria-invalid={Boolean(form.formState.errors.name)}
                      aria-describedby={form.formState.errors.name ? "name-error" : undefined}
                      {...form.register("name")}
                    />
                    {form.formState.errors.name ? (
                      <p id="name-error" role="alert" className="mt-2 text-sm text-danger">
                        {form.formState.errors.name.message}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <Label htmlFor="className">Turma (opcional)</Label>
                    <Input
                      id="className"
                      className="mt-2"
                      aria-invalid={Boolean(form.formState.errors.className)}
                      aria-describedby={form.formState.errors.className ? "class-error" : undefined}
                      {...form.register("className")}
                    />
                    {form.formState.errors.className ? (
                      <p id="class-error" role="alert" className="mt-2 text-sm text-danger">
                        {form.formState.errors.className.message}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <Label htmlFor="subject">Assunto de interesse</Label>
                    <Input
                      id="subject"
                      className="mt-2"
                      aria-invalid={Boolean(form.formState.errors.subject)}
                      aria-describedby={form.formState.errors.subject ? "subject-error" : undefined}
                      {...form.register("subject")}
                    />
                    {form.formState.errors.subject ? (
                      <p id="subject-error" role="alert" className="mt-2 text-sm text-danger">
                        {form.formState.errors.subject.message}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <Label htmlFor="notes">Observações não sensíveis (opcional)</Label>
                    <p id="notes-hint" className="mt-1 text-sm text-body">
                      Por exemplo, o horário da visita da turma. Sem dados de saúde.
                    </p>
                    <Textarea
                      id="notes"
                      className="mt-2"
                      aria-invalid={Boolean(form.formState.errors.notes)}
                      aria-describedby={form.formState.errors.notes ? "notes-error" : "notes-hint"}
                      {...form.register("notes")}
                    />
                    {form.formState.errors.notes ? (
                      <p id="notes-error" role="alert" className="mt-2 text-sm text-danger">
                        {form.formState.errors.notes.message}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="no-print mt-6 flex justify-between gap-3">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                    Voltar
                  </Button>
                  <Button type="submit">Confirmar agendamento</Button>
                </div>
              </form>
            ) : null}

            {step === 4 && created ? (
              <Confirmation appointment={created} onReset={reset} />
            ) : null}
          </div>
      </div>

      <aside className="no-print h-fit rounded-2xl border border-line bg-white p-5 lg:sticky lg:top-24">
        <p className="text-sm font-medium">Resumo da demonstração</p>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="text-muted">Serviço</dt>
            <dd className="mt-1 text-foreground">{service?.title ?? "Ainda não escolhido"}</dd>
          </div>
          <div>
            <dt className="text-muted">Data</dt>
            <dd className="mt-1 text-foreground">{date ? formatLongDate(date) : "Ainda não escolhida"}</dd>
          </div>
          <div>
            <dt className="text-muted">Horário</dt>
            <dd className="mt-1 text-foreground">{time ?? "Ainda não escolhido"}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function MonthCalendar({
  cursor,
  today,
  selected,
  minMonth,
  maxMonth,
  onCursor,
  onSelect,
}: {
  cursor: Date;
  today: string;
  selected: string | null;
  minMonth: Date;
  maxMonth: Date;
  onCursor: (date: Date) => void;
  onSelect: (iso: string) => void;
}) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ iso: string; day: number } | null> = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: count }, (_, index) => {
      const day = index + 1;
      return { day, iso: toISODate(new Date(year, month, day)) };
    }),
  ];
  const atStart = cursor.getFullYear() === minMonth.getFullYear() && cursor.getMonth() === minMonth.getMonth();
  const atEnd = cursor.getFullYear() === maxMonth.getFullYear() && cursor.getMonth() === maxMonth.getMonth();

  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="secondary" size="icon" aria-label="Mês anterior" disabled={atStart} onClick={() => onCursor(shiftMonth(cursor, -1))}>
          <ChevronLeft />
        </Button>
        <p className="text-sm font-medium capitalize">{formatMonth(cursor)}</p>
        <Button type="button" variant="secondary" size="icon" aria-label="Próximo mês" disabled={atEnd} onClick={() => onCursor(shiftMonth(cursor, 1))}>
          <ChevronRight />
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-muted">
        {weekdays.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell, index) => {
          if (!cell) return <div key={`empty-${index}`} />;
          const past = isPastDate(cell.iso);
          const isSelected = selected === cell.iso;
          const isToday = cell.iso === today;
          return (
            <button
              key={cell.iso}
              type="button"
              disabled={past}
              aria-pressed={isSelected}
              aria-label={formatLongDate(cell.iso)}
              onClick={() => onSelect(cell.iso)}
              className={cn(
                "flex h-10 items-center justify-center rounded-[8px] text-sm transition-colors duration-200",
                isSelected && "bg-primary text-white",
                !isSelected && isToday && "border border-tech text-foreground",
                !isSelected && !past && "hover:bg-[#eef5fb]",
                past && "cursor-not-allowed text-mist",
              )}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Confirmation({ appointment, onReset }: { appointment: Appointment; onReset: () => void }) {
  const service = getService(appointment.serviceId);
  return (
    <div>
      <div id="protocolo" className="rounded-2xl border border-line bg-white p-6 sm:p-8">
        <p className="text-xs font-medium tracking-[0.14em] text-institutional">GOLDEN GENETICS · LABORATÓRIO</p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Consulta demonstrativa agendada</h2>
        <p className="mt-2 font-mono text-sm text-tech">{appointment.protocol}</p>
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Nome</dt>
            <dd className="mt-1 font-medium">{appointment.name}</dd>
          </div>
          <div>
            <dt className="text-muted">Serviço</dt>
            <dd className="mt-1 font-medium">{service?.title}</dd>
          </div>
          <div>
            <dt className="text-muted">Data</dt>
            <dd className="mt-1 font-medium">{formatLongDate(appointment.date)}</dd>
          </div>
          <div>
            <dt className="text-muted">Horário</dt>
            <dd className="mt-1 font-medium">{appointment.time}</dd>
          </div>
          <div>
            <dt className="text-muted">Turma</dt>
            <dd className="mt-1 font-medium">{appointment.className || "Não informada"}</dd>
          </div>
          <div>
            <dt className="text-muted">Status</dt>
            <dd className="mt-1 font-medium">Consulta demonstrativa agendada</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted">Assunto de interesse</dt>
            <dd className="mt-1 font-medium">{appointment.subject}</dd>
          </div>
          {appointment.notes ? (
            <div className="sm:col-span-2">
              <dt className="text-muted">Observações</dt>
              <dd className="mt-1">{appointment.notes}</dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-6 text-sm leading-relaxed text-body">
          Comprovante fictício. Vale apenas como registro local desta demonstração, neste navegador.
        </p>
      </div>
      <div className="no-print mt-6 flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={() => window.print()}>
          Imprimir ou salvar PDF
        </Button>
        <Button type="button" variant="secondary" onClick={onReset}>
          Fazer outro agendamento
        </Button>
      </div>
    </div>
  );
}
