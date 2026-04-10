import { useNavigate } from "react-router-dom";
import { useProfileViewModel } from "../viewModel/useProfileViewModel";
import { SecurityHealthCard } from "../components/SecurityHealthCard";
import { SettingsRow } from "../components/SettingsRow";
import { PageShell } from "@/shared/components/layout/PageShell";
import { Avatar } from "@/shared/components/ui/Avatar";

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user, securityHealth, logout } = useProfileViewModel();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <PageShell topBarTitle="FacePay" bottomNav>
      <div className="px-6 pt-4 pb-24 max-w-md mx-auto space-y-6">
        {/* Avatar + Info */}
        <div className="flex flex-col items-center pt-2">
          <div className="relative mb-4">
            <Avatar
              name={user?.name ?? "User"}
              src={user?.avatar}
              size="lg"
              className="w-24 h-24 text-2xl border-4 border-white shadow-lg ring-1 ring-outline-variant/15"
            />
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center ring-2 ring-surface">
              <span
                className="material-symbols-outlined text-on-primary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-on-surface">
            {user?.name ?? "User"}
          </h2>
          <p className="text-sm text-on-surface-variant">
            {user?.mobile ?? ""}
          </p>
        </div>

        {/* Security Health */}
        <SecurityHealthCard health={securityHealth} />

        {/* Settings */}
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
          <SettingsRow
            icon="face_retouching_natural"
            label="Face ID Settings"
            onClick={() => navigate("/register-face")}
          />
          <SettingsRow icon="privacy_tip" label="Privacy & Security" />
          <SettingsRow icon="devices" label="Linked Devices" />
          <SettingsRow icon="help" label="Help & Support" />
        </div>

        {/* Logout */}
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
          <SettingsRow
            icon="logout"
            label="Logout"
            variant="danger"
            onClick={handleLogout}
          />
        </div>
      </div>
    </PageShell>
  );
}
