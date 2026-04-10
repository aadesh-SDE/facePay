import { Avatar } from "@/shared/components/ui/Avatar";
import type { Recipient } from "../types/send.types";

interface RecipientCardProps {
  recipient: Recipient;
  compact?: boolean;
  onClick?: () => void;
}

function maskMobile(mobile: string): string {
  if (mobile.length < 4) return mobile;
  return `••••••${mobile.slice(-4)}`;
}

export function RecipientCard({
  recipient,
  compact = false,
  onClick,
}: RecipientCardProps) {
  if (compact) {
    return (
      <div
        className={`bg-surface-container-lowest rounded-xl p-4 shadow-soft flex items-center gap-4 ${onClick ? "cursor-pointer hover:bg-surface-container-low transition-colors active:scale-[0.98]" : ""}`}
        onClick={onClick}
        role={onClick ? "button" : undefined}
      >
        <Avatar name={recipient.name} src={recipient.avatar} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-on-surface truncate">
            {recipient.name}
          </p>
          <p className="text-xs text-on-surface-variant">
            {maskMobile(recipient.mobile)}
          </p>
        </div>
        {onClick && (
          <span className="material-symbols-outlined text-outline-variant">
            chevron_right
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-3">
        <Avatar name={recipient.name} src={recipient.avatar} size="lg" />
        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center ring-2 ring-surface">
          <span
            className="material-symbols-outlined text-on-primary text-xs"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
        </div>
      </div>
      <p className="text-xl font-bold text-on-surface">{recipient.name}</p>
      <p className="text-sm text-on-surface-variant">
        {maskMobile(recipient.mobile)}
      </p>
    </div>
  );
}
