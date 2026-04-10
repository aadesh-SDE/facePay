import { formatCurrency } from "@/shared/utils/formatCurrency";
import type { Transaction } from "../types/history.types";

interface TransactionRowProps {
  transaction: Transaction;
}

const directionStyles = {
  sent: {
    iconBg: "bg-error-container/30",
    iconColor: "text-error",
    amountColor: "text-on-surface",
    badge: "bg-error-container text-on-error-container",
    prefix: "-",
    badgeLabel: "Sent",
  },
  received: {
    iconBg: "bg-secondary-container/30",
    iconColor: "text-secondary",
    amountColor: "text-secondary",
    badge: "bg-secondary-container text-on-secondary-container",
    prefix: "+",
    badgeLabel: "Received",
  },
};

export function TransactionRow({ transaction }: TransactionRowProps) {
  const style = directionStyles[transaction.direction];

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center justify-between hover:bg-surface-container-high transition-all">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center ${style.iconColor}`}
        >
          <span className="material-symbols-outlined">{transaction.icon}</span>
        </div>
        <div>
          <p className="font-bold text-on-surface text-sm">
            {transaction.title}
          </p>
          <p className="text-xs text-on-surface-variant">
            {transaction.subtitle}
          </p>
        </div>
      </div>
      <div className="text-right flex flex-col items-end gap-1">
        <p className={`font-extrabold text-sm ${style.amountColor}`}>
          {style.prefix}
          {formatCurrency(transaction.amount)}
        </p>
        <span
          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}
        >
          {style.badgeLabel}
        </span>
      </div>
    </div>
  );
}
