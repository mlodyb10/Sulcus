export function Footer() {
  return (
    <footer className="section-cream border-t border-[rgba(22,45,34,0.08)] py-16 px-8 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
        <div>
          <p className="font-serif text-[#162D22] text-3xl mb-2">Sulcus</p>
          <p className="text-[rgba(22,45,34,0.4)] text-[11px] tracking-[0.25em]">
            Ślad który zostawiasz. Ślad który zostawia świat.
          </p>
        </div>
        <p className="text-[rgba(22,45,34,0.3)] text-[11px] tracking-widest">© 2026 Sulcus</p>
      </div>
    </footer>
  )
}
