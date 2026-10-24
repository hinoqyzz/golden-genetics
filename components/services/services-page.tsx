import { Reveal } from "@/components/motion/reveal";
import { serviceSections } from "@/lib/content";

export function ServicesPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav className="lg:sticky lg:top-24 lg:self-start" aria-label="Seções educativas">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {serviceSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="shrink-0 rounded-full border border-line bg-white px-3 py-2 text-sm text-body transition-colors duration-200 hover:border-institutional hover:text-foreground lg:rounded-[10px]"
            >
              {section.kicker}
            </a>
          ))}
        </div>
      </nav>
      <div className="space-y-16">
        {serviceSections.map((section, index) => (
          <Reveal key={section.id} delay={index * 0.04}>
            <section id={section.id} className="anchor-section">
            <p className="text-sm font-medium text-institutional">{section.kicker}</p>
            <h2 className="mt-3 max-w-[20ch] text-3xl font-semibold tracking-[-0.03em]">{section.title}</h2>
            <div className="mt-5 max-w-[72ch] space-y-4">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-[16px] leading-relaxed text-body">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
