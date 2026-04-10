import type { ReactNode } from "react";
import { TopAppBar } from "./TopAppBar";
import { BottomNav } from "./BottomNav";

interface PageShellProps {
  children: ReactNode;
  topBar?: boolean;
  topBarTitle?: string;
  showBack?: boolean;
  bottomNav?: boolean;
  topBarRight?: ReactNode;
  className?: string;
}

export function PageShell({
  children,
  topBar = true,
  topBarTitle,
  showBack = false,
  bottomNav = false,
  topBarRight,
  className = "",
}: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col animate-page-in">
      {topBar && (
        <TopAppBar
          title={topBarTitle}
          showBack={showBack}
          rightElement={topBarRight}
        />
      )}
      <main
        role="main"
        className={`flex-1 ${topBar ? "pt-16" : ""} ${bottomNav ? "pb-20" : ""} ${className}`}
      >
        {children}
      </main>
      {bottomNav && <BottomNav />}
    </div>
  );
}
