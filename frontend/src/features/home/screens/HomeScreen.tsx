import { useHomeViewModel } from "../viewModel/useHomeViewModel";
import { BalanceCard } from "../components/BalanceCard";
import { QuickActions } from "../components/QuickActions";
import { RecentTransactions } from "../components/RecentTransactions";
import { PageShell } from "@/shared/components/layout/PageShell";
import { Avatar } from "@/shared/components/ui/Avatar";

export function HomeScreen() {
  const { user, balance, recentTransactions, loading } = useHomeViewModel();

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <PageShell
      topBarTitle="FacePay"
      bottomNav
      topBarRight={
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors">
          <span className="material-symbols-outlined text-teal-900">
            notifications
          </span>
        </button>
      }
      className="bg-surface"
    >
      <div className="px-6 space-y-8 max-w-md mx-auto pb-8">
        {/* Greeting */}
        <section className="space-y-1 flex items-center gap-4">
          <Avatar name={user?.name ?? "User"} size="md" />
          <div>
            <h1 className="text-2xl font-headline font-extrabold tracking-tight text-on-surface">
              Hello, {firstName}
            </h1>
            <p className="text-on-surface-variant text-sm font-medium">
              Ready for your next seamless payment?
            </p>
          </div>
        </section>

        <BalanceCard balance={balance} loading={loading} />
        <QuickActions />
        <RecentTransactions transactions={recentTransactions} loading={loading} />
      </div>
    </PageShell>
  );
}
