import { useNavigate } from "react-router-dom";
import { useReceiveViewModel } from "../viewModel/useReceiveViewModel";
import { QRDisplay } from "../components/QRDisplay";
import { PageShell } from "@/shared/components/layout/PageShell";
import { Icon } from "@/shared/components/ui/Icon";

export function MyQRCodeScreen() {
  const navigate = useNavigate();
  const { user, qrValue } = useReceiveViewModel();

  return (
    <PageShell topBarTitle="FacePay" showBack bottomNav>
      <div className="px-6 pt-4 pb-24 max-w-md mx-auto space-y-6">
        {/* Headline */}
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">
            Receive Money
          </h2>
          <p className="text-on-surface-variant text-sm font-medium mt-1">
            Show this QR code to receive payments instantly
          </p>
        </div>

        {/* QR Card */}
        {user && qrValue && (
          <QRDisplay
            value={qrValue}
            name={user.name}
            facepayId={user.email}
          />
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="h-14 bg-surface-container-high text-on-surface font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-xl">share</span>
            Share
          </button>
          <button className="h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary/10 flex items-center justify-center gap-2 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-xl">download</span>
            Save
          </button>
        </div>

        {/* Scan CTA */}
        <button
          onClick={() => navigate("/receive/scan")}
          className="w-full h-14 bg-surface-container-lowest border border-outline-variant/20 rounded-xl flex items-center justify-center gap-3 text-on-surface font-semibold hover:bg-surface-container-low transition-colors active:scale-95"
        >
          <Icon name="qr_code_scanner" size="sm" className="text-primary" />
          Scan a QR Code
        </button>

        {/* Tip */}
        <div className="bg-tertiary-fixed/30 rounded-3xl border border-tertiary-fixed-dim/20 p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-tertiary text-lg">
              security
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface mb-1">
              Safe & Private
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Your QR code only shares your FacePay ID. No personal banking
              details are exposed.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
