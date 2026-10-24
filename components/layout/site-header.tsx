"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/content";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const first = menuRef.current?.querySelector<HTMLElement>("a");
    first?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b border-line backdrop-blur-md transition-[background-color,box-shadow] duration-200",
        scrolled ? "bg-white/95 shadow-[0_8px_24px_rgba(8,47,112,0.04)]" : "bg-white/80",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-1 text-sm text-body transition-colors duration-200 hover:text-foreground",
                  active && "font-medium text-foreground",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute right-0 -bottom-1 left-0 h-px origin-left bg-institutional transition-transform duration-200 ease-out",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/consultas">Agendar consulta</Link>
          </Button>
          <Button
            ref={toggleRef}
            type="button"
            variant="secondary"
            size="icon"
            className="lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
            <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0",
        )}
      >
        <nav
          ref={menuRef}
          id="menu-mobile"
          aria-label="Mobile"
          aria-hidden={!open}
          inert={open ? undefined : true}
          className="overflow-hidden border-t border-line bg-white"
        >
          <ul className="flex flex-col px-4 py-3">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    tabIndex={open ? 0 : -1}
                    className={cn(
                      "block rounded-[10px] px-3 py-3 text-base text-body transition-colors duration-200 hover:bg-[#f3f8fd] hover:text-foreground",
                      active && "bg-[#f3f8fd] font-medium text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="px-4 pb-4 sm:hidden">
            <Button asChild className="w-full">
              <Link href="/consultas" tabIndex={open ? 0 : -1}>
                Agendar consulta
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
