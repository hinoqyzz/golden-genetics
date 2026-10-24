import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[10px] border border-line bg-white px-3 text-sm text-foreground transition-colors placeholder:text-muted disabled:cursor-not-allowed disabled:bg-[#f3f6fa]",
        className,
      )}
      {...props}
    />
  );
}
