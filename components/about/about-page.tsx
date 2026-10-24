import { Reveal } from "@/components/motion/reveal";
import { objectives, team } from "@/lib/content";

export function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <Reveal>
        <div className="max-w-[70ch] space-y-4 text-[16px] leading-relaxed text-body">
        <p>
          A Golden Genetics é um laboratório fictício criado para uma feira de ciências. O nome, o símbolo e as consultas existem para organizar uma conversa sobre genética. Não há laboratório clínico, equipe de saúde nem atendimento por trás deste site.
        </p>
        <p>
          A visita foi pensada para estudantes e para quem passa pelo estande: entender o básico da hereditariedade, ver até onde a biotecnologia chegou e perceber onde a ideia de bebê sob medida deixa de ser ciência e vira exagero.
        </p>
      </div>
      </Reveal>
      <ol className="mt-12 grid gap-8 md:grid-cols-2">
        {objectives.map((item, index) => (
          <li key={item.title} className="border-t border-line pt-5">
            <Reveal delay={index * 0.08}>
            <p className="font-mono text-sm text-tech">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-body">{item.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
      <section className="mt-16">
        <h2 className="text-3xl font-semibold tracking-[-0.03em]">Equipe da feira</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {team.map((name) => (
            <li key={name} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#e7f1fa] text-sm font-medium text-institutional" aria-hidden>
                {initials(name)}
              </span>
              <p className="font-medium">{name}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase();
}
