import { ArrowRight, Dna, FlaskConical, MessagesSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { DnaHelix } from "@/components/brand/dna-helix";
import { HeroEntrance } from "@/components/home/hero-entrance";
import { DecorParallax } from "@/components/motion/decor-parallax";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { scienceTopics, visitSteps } from "@/lib/content";

const icons = {
  dna: Dna,
  share: Share2,
  flask: FlaskConical,
  messages: MessagesSquare,
};

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <HeroArcs />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:py-8">
          <div>
            <HeroEntrance>
              <p className="text-[13px] font-medium tracking-[0.16em] text-institutional">
                GOLDEN GENETICS • LABORATÓRIO
              </p>
            </HeroEntrance>
            <HeroEntrance delay={0.08}>
              <h1 className="mt-5 max-w-[11em] text-[2.55rem] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-6xl">
                O futuro da genética começa aqui.
              </h1>
            </HeroEntrance>
            <HeroEntrance delay={0.16}>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-body">
                Explore a ciência por trás da hereditariedade humana e descubra como a genética influencia as características das próximas gerações.
              </p>
            </HeroEntrance>
            <HeroEntrance delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/consultas">Agendar uma consulta</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/servicos">Explorar genética</Link>
                </Button>
              </div>
            </HeroEntrance>
          </div>
          <HeroEntrance delay={0.1}>
          <figure>
            <DnaHelix />
          </figure>
          </HeroEntrance>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Ciência e inovação</h2>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {scienceTopics.map((topic, index) => {
            const Icon = icons[topic.icon];
            return (
              <Reveal key={topic.href} delay={index * 0.08} className="h-full">
                <Link href={topic.href} className="group flex h-full flex-col bg-white p-6 transition-[background-color,border-color,transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:bg-[#f8fbfe] hover:shadow-[0_10px_28px_rgba(8,47,112,0.06)] sm:p-8">
                  <Icon className="size-5 text-institutional" strokeWidth={1.75} />
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{topic.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">{topic.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-institutional">
                    Ler explicação
                    <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-[3px]" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Como funciona</h2>
          </Reveal>
          <div className="relative mt-12">
            <div className="absolute top-3 right-8 left-8 hidden h-px bg-line md:block" aria-hidden />
            <ol className="grid gap-10 md:grid-cols-3">
              {visitSteps.map((step, index) => (
                <li key={step.number} className="relative">
                  <Reveal delay={index * 0.06}>
                    <Link href={step.href} className="group block rounded-xl">
                      <span className="relative z-10 inline-flex bg-white pr-3 font-mono text-sm text-tech">{step.number}</span>
                      <h3 className="mt-4 text-xl font-semibold tracking-tight group-hover:text-institutional">{step.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-body">{step.text}</p>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <div className="rounded-[28px] border border-line bg-white px-6 py-10 sm:px-10 sm:py-14">
            <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Até onde podemos ir com a genética?
            </h2>
            <p className="mt-5 max-w-[68ch] text-lg leading-relaxed text-body">
              “Bebê sob medida” é uma ideia popular, não um procedimento disponível. Três caminhos costumam ser misturados. Eles não fazem a mesma coisa.
            </p>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <article>
                <h3 className="text-lg font-semibold">Herança natural</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-body">
                  Óvulo e espermatozoide reúnem cromossomos dos dois progenitores. O resultado é uma combinação nova, não um catálogo. Irmãos podem ser bem diferentes.
                </p>
              </article>
              <article>
                <h3 className="text-lg font-semibold">Seleção embrionária</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-body">
                  Em fertilização in vitro, alguns testes analisam embriões em busca de alterações cromossômicas ou de variantes ligadas a doenças graves já conhecidas. Isso não desenha personalidade, talento ou aparência.
                </p>
              </article>
              <article>
                <h3 className="text-lg font-semibold">Edição genética</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-body">
                  Ferramentas como o CRISPR-Cas9 podem alterar uma sequência de DNA em pesquisa ou em células do corpo. Editar um embrião para nascimento não é prática clínica aceita e, no Brasil, é proibida.
                </p>
              </article>
            </div>
            <p className="mt-10 max-w-[74ch] border-t border-line pt-6 text-[15px] leading-relaxed text-body">
              Inteligência, altura e aparência dependem de muitos genes e também do ambiente. A escolha precisa dessas características não é uma capacidade clínica estabelecida. A simulação genética, em outra página, calcula apenas modelos didáticos de um gene. Ela não prevê um bebê.
            </p>
            <Button asChild className="mt-8" size="lg">
              <Link href="/simulador">Explorar simulação genética</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function HeroArcs() {
  return (
    <DecorParallax className="pointer-events-none absolute -left-10 top-8 hidden h-[280px] w-[180px] lg:block">
      <svg className="h-full w-full" viewBox="0 0 180 280" aria-hidden>
        <path d="M170 10C60 30 20 110 36 180c14 58-8 90-30 110" fill="none" stroke="#168AD2" strokeWidth="18" opacity="0.18" strokeLinecap="round" />
        <path d="M150 46c-70 16-96 78-78 132" fill="none" stroke="#075CA8" strokeWidth="8" opacity="0.28" strokeLinecap="round" />
        <g stroke="#075CA8" strokeWidth="1.2" opacity="0.4">
          <line x1="118" y1="28" x2="146" y2="12" />
          <line x1="124" y1="38" x2="152" y2="22" />
          <line x1="130" y1="48" x2="158" y2="32" />
          <line x1="136" y1="58" x2="164" y2="42" />
        </g>
      </svg>
    </DecorParallax>
  );
}
