 import Container from "@/Container";

const columns = [
  {
    title: "Shop",
    links: ["New Collection", "Bespoke", "Archive"],
  },
  {
    title: "Company",
    links: ["Our Story", "Philosophy", "Contact"],
  },
  {
    title: "Follow",
    links: ["Instagram", "Journal"],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-white">
      <Container className="relative pt-16">

        {/* الصف الرئيسي: الشعار + الأعمدة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-6">

          {/* الشعار والوصف */}
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-headline-md tracking-[0.2em] mb-4">
              AURA
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-body-md text-black/50 leading-relaxed max-w-[220px]">
              Curating the essence of modern luxury through timeless design
              and architectural purity.
            </p>
          </div>

          {/* الأعمدة */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-[family-name:var(--font-inter)] text-label-sm text-black/40 mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      className="cursor-pointer font-[family-name:var(--font-inter)] text-body-md text-black/80 hover:text-black transition-colors duration-300"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* الـ Watermark الممتد */}
        <div className="relative h-40 md:h-56 -mx-5 sm:-mx-[34px] lg:-mx-12 xl:-mx-[70px] overflow-hidden flex items-start justify-center">
          <svg
            viewBox="0 0 1200 220"
            preserveAspectRatio="xMidYMin meet"
            className="w-full h-full"
            aria-hidden="true"
          >
            <text
              x="50%"
              y="180"
              textAnchor="middle"
              className="font-[family-name:var(--font-playfair)] fill-black/[0.08]"
              style={{ fontSize: "220px" }}
            >
              AURA
            </text>
          </svg>
        </div>

        {/* السطر السفلي */}
        <div className="pb-8 -mt-6 relative font-[family-name:var(--font-inter)] text-body-md text-black/60 text-center md:text-left">
          Kirols Creations © 2026
        </div>

      </Container>
    </footer>
  );
}