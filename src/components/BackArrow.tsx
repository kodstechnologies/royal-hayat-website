import { ArrowLeft, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackArrow({ className, ...props }: LucideProps) {
  return <ArrowLeft className={cn("back-arrow shrink-0", className)} {...props} />;
}
