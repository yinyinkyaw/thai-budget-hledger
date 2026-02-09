import { formatCurrency } from "@/lib/currency";

export function Header() {
  return (
    <header className="border-b border-dashed bg-card">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-5">
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total Balance
            </span>
            <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {formatCurrency(2990)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <slot name="theme-toggle" />
        </div>
      </div>
    </header>
  );
}
