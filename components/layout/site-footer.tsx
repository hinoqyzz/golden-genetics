import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { navItems } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[auto_1fr_1fr] md:items-start">
        <Logo variant="footer" />
        <div>
          <p className="text-sm font-medium text-foreground">Navegação</p>
          <ul className="mt-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-body transition-colors duration-200 ease-out hover:text-institutional">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin" className="text-sm text-body transition-colors duration-200 ease-out hover:text-institutional">
                Painel demonstrativo
              </Link>
            </li>
          </ul>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-body">
          A Golden Genetics é um laboratório fictício de divulgação científica. O site apresenta genética humana, hereditariedade e bioética para uma feira de ciências.
        </p>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-5 text-sm leading-relaxed text-body sm:px-8">
          Projeto fictício e educativo desenvolvido para uma feira de ciências. Não oferece serviços médicos reais.
        </p>
      </div>
    </footer>
  );
}
