import Image from "next/image";
import Link from "next/link";

export function Logo({ variant = "header" }: { variant?: "header" | "footer" }) {
  if (variant === "footer") {
    return (
      <Image
        src="/branding/logo-lockup.png"
        alt="Golden Genetics Laboratório"
        width={310}
        height={320}
        className="h-auto w-[168px]"
      />
    );
  }

  return (
    <Link href="/" aria-label="Golden Genetics, início" className="flex items-center gap-2.5 rounded-md">
      <Image
        src="/branding/logo-mark.png"
        alt=""
        width={176}
        height={176}
        priority
        className="h-11 w-11"
      />
      <span aria-hidden className="leading-[1.05]">
        <span className="block text-[13px] font-semibold tracking-[0.16em] text-primary">GOLDEN</span>
        <span className="block text-[13px] font-semibold tracking-[0.16em] text-tech">GENETICS</span>
      </span>
    </Link>
  );
}
