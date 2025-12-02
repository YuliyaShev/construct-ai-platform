type Props = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/40 p-6 text-center space-y-2">
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</div>
      {description && <div className="text-xs text-slate-500">{description}</div>}
    </div>
  );
}
