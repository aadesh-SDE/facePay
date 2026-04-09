import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../ui/Icon";

interface NavItem {
  path: string;
  icon: string;
  filledIcon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: "/", icon: "home", filledIcon: "home", label: "Home" },
  { path: "/history", icon: "receipt_long", filledIcon: "receipt_long", label: "History" },
  { path: "/receive", icon: "qr_code_2", filledIcon: "qr_code_2", label: "Receive" },
  { path: "/profile", icon: "person", filledIcon: "person", label: "Profile" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl shadow-whisper-up pb-safe-offset-2">
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 min-w-[64px] py-1 transition-colors"
            >
              <Icon
                name={isActive ? item.filledIcon : item.icon}
                filled={isActive}
                size="md"
                className={
                  isActive ? "text-primary" : "text-on-surface-variant"
                }
              />
              <span
                className={`text-[10px] font-semibold ${isActive ? "text-primary" : "text-on-surface-variant"}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
