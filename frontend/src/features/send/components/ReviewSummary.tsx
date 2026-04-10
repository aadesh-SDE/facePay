import { formatCurrency } from "@/shared/utils/formatCurrency";
import type { Recipient } from "../types/send.types";
import { RecipientCard } from "./RecipientCard";

interface ReviewSummaryProps {
  recipient: Recipient;
  amount: number;
  note: string;
  fee: number;
  balance: number;
}

export function ReviewSummary({
  recipient,
  amount,
  note,
  fee,
  balance,
}: ReviewSummaryProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-whisper border border-outline-variant/10">
      {/* Recipient */}
      <div className="flex flex-col items-center mb-6">
        <RecipientCard recipient={recipient} />
        <div className="mt-4 text-center">
          <p className="text-[40px] font-extrabold text-primary tracking-tight">
            {formatCurrency(amount)}
          </p>
          {note && (
            <span className="inline-block mt-2 bg-surface-container-low text-on-surface-variant text-xs font-medium px-4 py-1.5 rounded-full">
              {note}
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 pt-4 border-t border-dashed border-outline-variant/50">
        {/* From */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-primary-container text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance_wallet
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                From
              </p>
              <p className="text-sm font-semibold text-on-surface">
                FacePay Wallet
              </p>
            </div>
          </div>
          <p className="text-sm font-bold text-on-surface">
            {formatCurrency(balance)}
          </p>
        </div>

        <div className="border-t border-dashed border-outline-variant/50" />

        {/* Fee */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Transaction Fee
          </p>
          {fee === 0 ? (
            <span className="bg-secondary-container/30 text-secondary text-xs font-bold px-3 py-1 rounded-full">
              Free
            </span>
          ) : (
            <p className="text-sm font-bold text-on-surface">
              {formatCurrency(fee)}
            </p>
          )}
        </div>
      </div>

      {/* Security */}
      <div className="mt-6 bg-primary-fixed/10 p-4 rounded-xl flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-xl mt-0.5">
          security_update_good
        </span>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          This transaction is secured with FaceID verification and end-to-end
          encryption.
        </p>
      </div>
    </div>
  );
}
