import { QRCodeSVG } from "qrcode.react";
import { Icon } from "@/shared/components/ui/Icon";

interface QRDisplayProps {
  value: string;
  name: string;
  facepayId: string;
}

export function QRDisplay({ value, name, facepayId }: QRDisplayProps) {
  function handleCopy() {
    navigator.clipboard.writeText(facepayId);
  }

  return (
    <div className="relative bg-surface-container-lowest rounded-[2rem] p-6 shadow-whisper border border-outline-variant/10">
      {/* Decorative blurs */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* QR Code */}
        <div className="bg-white p-4 rounded-[2.5rem] border border-outline-variant/10 mb-4">
          <QRCodeSVG
            value={value}
            size={220}
            level="M"
            bgColor="transparent"
            fgColor="#191c1d"
          />
        </div>

        {/* Center logo overlay */}
        <div className="absolute top-[calc(50%-40px)] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-1.5 shadow-sm">
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
            <Icon
              name="face"
              filled
              size="sm"
              className="text-on-primary-container"
            />
          </div>
        </div>

        {/* Name */}
        <p className="text-lg font-bold text-on-surface mb-1">{name}</p>

        {/* FacePay ID */}
        <div className="flex items-center gap-2">
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-outline">
            FacePay ID
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="mt-1 flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
        >
          <span className="text-sm font-bold text-primary">{facepayId}</span>
          <span className="material-symbols-outlined text-outline text-sm">
            content_copy
          </span>
        </button>
      </div>
    </div>
  );
}
