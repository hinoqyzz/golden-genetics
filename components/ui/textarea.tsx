import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-[10px] border border-line bg-white px-3 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted",
        className,
      )}
      {...props}
    />
  );
}
