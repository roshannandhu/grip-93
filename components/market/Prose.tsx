export type Section = { h?: string; p?: string[]; ul?: string[] };

export default function Prose({ title, lead, sections }: { title: string; lead?: string; sections: Section[] }) {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">{title}</h1>
      {lead && <p className="mt-3 text-lg text-white/65">{lead}</p>}
      <div className="mt-8 space-y-8">
        {sections.map((s, i) => (
          <section key={i} className="rounded-2xl glass p-6">
            {s.h && <h2 className="font-display text-xl font-bold">{s.h}</h2>}
            {s.p?.map((para, j) => <p key={j} className="mt-3 text-white/65">{para}</p>)}
            {s.ul && (
              <ul className="mt-3 space-y-2 text-white/65">
                {s.ul.map((li, j) => <li key={j} className="flex gap-2"><span className="text-flame">•</span><span>{li}</span></li>)}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
