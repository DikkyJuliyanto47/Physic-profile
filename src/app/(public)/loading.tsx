export default function PublicLoading() {
  return (
    <div className="animate-pulse bg-neutral-50">
      <div className="h-52 bg-primary-900 sm:h-64" />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-5 w-40 rounded bg-neutral-200" />
        <div className="h-9 max-w-xl rounded bg-neutral-200" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
            >
              <div className="aspect-video bg-neutral-200" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 rounded bg-neutral-200" />
                <div className="h-4 w-full rounded bg-neutral-100" />
                <div className="h-4 w-2/3 rounded bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
