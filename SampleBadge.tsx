import { Info } from "lucide-react";

export function SampleBadge({ text, className }: { text: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200 ${className ?? ""}`}
    >
      <Info className="h-3.5 w-3.5" />
      {text}
    </span>
  );
}

export function SampleNote({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm text-amber-800">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      <p>{text}</p>
    </div>
  );
}
