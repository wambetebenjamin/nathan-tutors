import Link from "next/link";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export function LegalDocument({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <section className="site-section-cover overlay inner-page" style={{ backgroundImage: "url('/images/hero_bg.jpg')" }}>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-9 text-center">
              <h1>
                <strong>{title}</strong>
              </h1>
              <p className="mb-0">Last updated {updated}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section-sm" style={{ paddingTop: 34 }}>
        <div className="container">
          <nav aria-label="Breadcrumb" className="nt-small nt-muted mb-4">
            <Link href="/">Home</Link>
            <span className="nt-divider-dot">/</span>
            <span>{title}</span>
          </nav>

          <div className="row">
            <div className="col-lg-8">
              <div className="nt-card nt-card-pad">
                <p style={{ fontSize: 16, color: "#353535" }}>{intro}</p>
                {sections.map((section, index) => (
                  <div key={section.heading} className="mt-4">
                    <h2 style={{ fontSize: 19, fontWeight: 700 }}>
                      {index + 1}. {section.heading}
                    </h2>
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph} style={{ fontSize: 14, color: "#353535" }}>
                        {paragraph}
                      </p>
                    ))}
                    {section.list ? (
                      <ul className="nt-list">
                        {section.list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4 mt-4 mt-lg-0">
              <div className="nt-card nt-card-pad">
                <h2 style={{ fontSize: 17, fontWeight: 700 }}>Other policies</h2>
                <ul className="nt-list mb-0">
                  <li>
                    <Link href="/legal/terms">Terms of service</Link>
                  </li>
                  <li>
                    <Link href="/legal/privacy-policy">Privacy policy</Link>
                  </li>
                  <li>
                    <Link href="/legal/cookie-policy">Cookie policy</Link>
                  </li>
                </ul>
                <hr className="nt-rule" />
                <p className="nt-small nt-muted mb-1">Questions about this page?</p>
                <p className="nt-small mb-0">
                  Email <a href="mailto:hello@nathan-tutors.co.ke">hello@nathan-tutors.co.ke</a>
                  <br />
                  WhatsApp +254 112 272 061
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
