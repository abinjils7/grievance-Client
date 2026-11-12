export default function PageHero({ eyebrow, title, description, action, children }) {
  return (
    <section className="relative isolate overflow-hidden border-y border-[#0b4e83] bg-[#082f65] px-6 py-10 text-white sm:px-10 sm:py-14">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 -z-10 hidden w-[30%] bg-gradient-to-br from-[#0b69a5] to-[#0d4b87] lg:block"
      />
      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:pr-[8%]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-sky-200">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">{description}</p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children && <div className="relative mt-9">{children}</div>}
    </section>
  );
}
