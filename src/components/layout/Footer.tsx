export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[rgba(237,227,204,0.08)] py-16 px-8 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
        <div>
          <p className="font-serif text-[#EDE3CC] text-3xl mb-2">Sulcus</p>
          <p className="text-[rgba(237,227,204,0.3)] text-[11px] tracking-[0.25em]">
            Ślad który zostawiasz. Ślad który zostawia świat.
          </p>
        </div>
        <p className="text-[rgba(237,227,204,0.2)] text-[11px] tracking-widest">© 2026 Sulcus</p>
      </div>
    </footer>
  )
}
