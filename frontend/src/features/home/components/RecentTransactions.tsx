import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { SkeletonCircle, SkeletonText } from "@/shared/components/ui/Skeleton";
import type { RecentTransaction } from "../types/home.types";

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  loading?: boolean;
}

const directionStyles = {
  sent: {
    iconBg: "bg-error-container/30",
    iconColor: "text-error",
    amountColor: "text-on-surface",
    prefix: "-",
  },
  received: {
    iconBg: "bg-secondary-container/30",
    iconColor: "text-secondary",
    amountColor: "text-secondary",
    prefix: "+",
  },
};

function SkeletonRow() {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SkeletonCircle className="w-12 h-12" />
        <div className="space-y-2">
          <SkeletonText className="w-28" />
          <SkeletonText className="w-20 h-3" />
        </div>
      </div>
      <SkeletonText className="w-20 h-5" />
    </div>
  );
}

export function RecentTransactions({
  transactions,
  loading,
}: RecentTransactionsProps) {
  const navigate = useNavigate();

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-on-surface">
          Recent Transactions
        </h3>
        <button
          onClick={() => navigate("/history")}
          className="text-primary text-xs font-bold px-3 py-1 rounded-full bg-secondary-container/30 hover:bg-secondary-container/50 transition-colors active:scale-95"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : transactions.length === 0 ? (
          <div className="bg-surface-container-lowest p-8 rounded-lg text-center">
            <span className="material-symbols-outlined text-4xl text-outline mb-2 block">
              receipt_long
            </span>
            <p className="text-on-surface-variant text-sm font-medium">
              No transactions yet
            </p>
          </div>
        ) : (
          transactions.map((tx) => {
            const style = directionStyles[tx.direction];
            return (
              <div
                key={tx.id}
                className="bg-surface-container-lowest p-4 rounded-lg flex items-center justify-between group transition-all hover:bg-surface-container-low"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center ${style.iconColor}`}
                  >
                    <span className="material-symbols-outlined">
                      {tx.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{tx.title}</p>
                    <p className="text-xs text-on-surface-variant">
                      {tx.subtitle}
                    </p>
                  </div>
                </div>
                <p className={`font-extrabold ${style.amountColor}`}>
                  {style.prefix}
                  {formatCurrency(tx.amount)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
