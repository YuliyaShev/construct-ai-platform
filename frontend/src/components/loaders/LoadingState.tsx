export default function LoadingState({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <div className="h-2 w-2 animate-ping rounded-full bg-brand-600" />
      {label || "Loading..."}
    </div>
  );
}
