import { formatCurrency } from "@/shared/utils/formatCurrency";

interface BalanceCardProps {
  balance: number;
  loading?: boolean;
}

export function BalanceCard({ balance, loading }: BalanceCardProps) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-container p-8 text-on-primary-container shadow-xl">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-start">
          <span className="text-sm font-bold uppercase tracking-widest opacity-80">
            Demo Balance
          </span>
          <span className="material-symbols-outlined">contactless</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-4xl font-extrabold tracking-tight text-on-primary-container">
            {loading ? (
              <span className="inline-block w-48 h-10 bg-white/20 rounded-lg animate-pulse" />
            ) : (
              formatCurrency(balance)
            )}
          </h2>
          <p className="text-xs font-medium opacity-70">
            Secured with FaceID Active
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="h-1.5 w-12 rounded-full bg-on-primary-container/30" />
          <div className="h-1.5 w-4 rounded-full bg-on-primary-container" />
        </div>
      </div>
    </section>
  );
}
