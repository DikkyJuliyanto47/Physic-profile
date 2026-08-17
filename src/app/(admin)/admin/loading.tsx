export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-52 rounded bg-neutral-200" />
        <div className="h-4 w-80 max-w-full rounded bg-neutral-100" />
      </div>
      <div className="flex gap-3">
        <div className="h-10 flex-1 rounded-lg bg-neutral-200" />
        <div className="h-10 w-28 rounded-lg bg-neutral-200" />
      </div>
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="h-12 bg-neutral-100" />
        <div className="space-y-4 p-5">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-10 rounded bg-neutral-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
