interface DateGroupHeaderProps {
  label: string;
}

export function DateGroupHeader({ label }: DateGroupHeaderProps) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 px-1">
      {label}
    </p>
  );
}
