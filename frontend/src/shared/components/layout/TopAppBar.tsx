import { useNavigate } from "react-router-dom";

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function TopAppBar({
  title = "FacePay",
  showBack = false,
  rightElement,
}: TopAppBarProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl">
      <div className="flex justify-between items-center px-6 h-16 w-full">
        <div className="flex items-center gap-4">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="hover:bg-slate-200/50 transition-colors p-2 rounded-full"
            >
              <span className="material-symbols-outlined text-teal-900">
                arrow_back
              </span>
            </button>
          ) : (
            <div className="w-10" />
          )}
          <span className="font-headline font-extrabold text-teal-800 tracking-tighter text-lg">
            {title}
          </span>
        </div>
        {rightElement ?? <div className="w-10" />}
      </div>
    </header>
  );
}
