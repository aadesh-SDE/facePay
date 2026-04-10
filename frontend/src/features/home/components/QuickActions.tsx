import { useNavigate } from "react-router-dom";

interface QuickActionItem {
  icon: string;
  label: string;
  route: string;
}

const ACTIONS: QuickActionItem[] = [
  { icon: "send", label: "Send", route: "/send" },
  { icon: "qr_code_scanner", label: "Receive", route: "/receive" },
  { icon: "history", label: "History", route: "/history" },
  { icon: "add", label: "Add Funds", route: "/add-funds" },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="grid grid-cols-4 gap-4">
      {ACTIONS.map((action) => (
        <div key={action.route} className="flex flex-col items-center gap-2">
          <button
            onClick={() => navigate(action.route)}
            className="w-14 h-14 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-center hover:bg-surface-container-high transition-colors text-primary active:scale-95"
          >
            <span className="material-symbols-outlined text-[28px]">
              {action.icon}
            </span>
          </button>
          <span className="text-[11px] font-bold text-on-surface-variant">
            {action.label}
          </span>
        </div>
      ))}
    </section>
  );
}
