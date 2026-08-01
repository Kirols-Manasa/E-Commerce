import Link from "next/link";
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
    links: ["Instagram", "Journal", "LinkedIn"],
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
                    {link === "LinkedIn" ? (
                      <Link
                        href="https://linkedin.com/in/kirols-manasa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer font-[family-name:var(--font-inter)] text-body-md text-black/80 hover:text-black transition-colors duration-300"
                      >
                        LinkedIn
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="cursor-pointer font-[family-name:var(--font-inter)] text-body-md text-black/80 hover:text-black transition-colors duration-300"
                      >
                        {link}
                      </button>
                    )}
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
        <div className="pb-8 -mt-6 relative font-[family-name:var(--font-inter)] text-body-md text-black/60 flex flex-col md:flex-row items-center md:items-center justify-between gap-4 text-center md:text-left">
          <span>Kirols Creations © 2026</span>

          <div className="flex items-center gap-3">
            <span className="text-black/40">
              Built &amp; designed by{" "}
              <span className="text-black/70 font-medium">Kirols Manasa</span>
            </span>

            {/* GitHub */}
            <Link
              href="https://github.com/Kirols-Manasa/E-Commerce.git"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="
                inline-flex items-center justify-center
                w-9 h-9 rounded-full
                border border-black/10
                text-black/60 hover:text-black hover:border-black/30
                transition-colors duration-300
                cursor-pointer
              "
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.17.69-3.84-1.34-3.84-1.34-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.69.08-.69 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.57.23 2.73.11 3.02.73.8 1.17 1.82 1.17 3.06 0 4.37-2.66 5.34-5.2 5.62.41.36.77 1.06.77 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A11.03 11.03 0 0 0 23.02 11.52C23.02 5.24 18.27.5 12 .5Z" />
              </svg>
            </Link>

            {/* LinkedIn */}
            <Link
              href="https://linkedin.com/in/kirols-manasa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View profile on LinkedIn"
              className="
                inline-flex items-center justify-center
                w-9 h-9 rounded-full
                border border-black/10
                text-black/60 hover:text-black hover:border-black/30
                transition-colors duration-300
                cursor-pointer
              "
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </Link>
          </div>
        </div>

      </Container>
    </footer>
  );
}