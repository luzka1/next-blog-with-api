export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-slate-900 bg-slate-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-8">{children}</div>
    </div>
  );
}
