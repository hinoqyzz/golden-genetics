import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">Esta página não existe.</h1>
      <p className="mt-4 text-lg leading-relaxed text-body">O endereço não faz parte da visita da Golden Genetics.</p>
      <Button asChild className="mt-8">
        <Link href="/">Voltar ao início</Link>
      </Button>
    </div>
  );
}
