import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer
      className="mt-24 border-t"
      style={{ borderColor: "var(--line)" }}
    >
      <div
        className="mx-auto max-w-6xl px-6 py-10 text-sm md:px-10"
        style={{ color: "var(--muted)" }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p>
              Built by{" "}
              <Link
                href="https://arminoorata.com"
                className="underline underline-offset-4"
                style={{ color: "var(--text)" }}
              >
                Armi Noorata
              </Link>
              .
            </p>
            <p className="mt-1.5 text-xs">
              Free tools for Total Rewards, job architecture, and better people decisions.
            </p>
          </div>
          <div className="flex flex-col gap-1 text-xs md:items-end">
            <Link
              href="/methodology"
              className="underline underline-offset-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Methodology &amp; sources
            </Link>
            <Link
              href="https://arminoorata.com/mark"
              aria-label="Why A to the n and A to the alpha?"
              className="hover:text-[var(--accent)] transition-colors"
            >
              Why A<sup>n</sup> and A<sup>α</sup>?
            </Link>
            <p className="mt-2 uppercase tracking-[0.24em]">
              jobarchitecture.arminoorata.com
            </p>
          </div>
        </div>

        <p
          className="mt-7 border-t pt-5 text-[11.5px] italic leading-7 opacity-85"
          style={{ borderColor: "var(--line)" }}
        >
          This tool provides directional job architecture education and a
          directional level recommendation based on general market practices. It
          is intended for guidance only and should be used alongside internal
          calibration, licensed market data, and professional judgment. It does
          not reproduce proprietary Radford, Mercer, WTW, or other survey
          provider methodology, and it is not a compensation, legal, compliance,
          or final decision engine.
        </p>
      </div>
    </footer>
  );
}
