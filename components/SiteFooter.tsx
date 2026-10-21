import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { SITE, whatsappHref } from "@/lib/data";
import { CookieSettingsButton } from "./CookieSettingsButton";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 mb-5 mb-lg-0">
            <h2 className="footer-heading mb-4">Nathan Tutors</h2>
            <p>
              Verified Kenyan tutors for primary, secondary and university students.
              One-on-one online sessions, booked in minutes.
            </p>
            <ul className="list-unstyled social">
              <li>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                  <span className="icon-whatsapp" />
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} aria-label="Email Nathan Tutors">
                  <span className="icon-mail" />
                </a>
              </li>
              <li>
                <a href={`tel:+${SITE.whatsapp}`} aria-label="Call Nathan Tutors">
                  <span className="icon-phone" />
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-8 ml-auto">
            <div className="row">
              <div className="col-6 col-lg-3 mb-4 mb-lg-0">
                <h2 className="footer-heading mb-4">Learn</h2>
                <ul className="list-unstyled">
                  <li><Link href="/tutors">Find a tutor</Link></li>
                  <li><Link href="/tutors?level=primary">Primary tutoring</Link></li>
                  <li><Link href="/tutors?level=secondary">Secondary tutoring</Link></li>
                  <li><Link href="/tutors?level=university">University units</Link></li>
                </ul>
              </div>
              <div className="col-6 col-lg-3 mb-4 mb-lg-0">
                <h2 className="footer-heading mb-4">Teach</h2>
                <ul className="list-unstyled">
                  <li><Link href="/become-a-tutor">Become a tutor</Link></li>
                  <li><Link href="/tutor/dashboard">Tutor dashboard</Link></li>
                  <li><Link href="/auth/signup?role=tutor">Tutor sign up</Link></li>
                </ul>
              </div>
              <div className="col-6 col-lg-3 mb-4 mb-lg-0">
                <h2 className="footer-heading mb-4">Account</h2>
                <ul className="list-unstyled">
                  <li><Link href="/auth/signin">Sign in</Link></li>
                  <li><Link href="/auth/signup">Create an account</Link></li>
                  <li><Link href="/my-sessions">My sessions</Link></li>
                  <li><Link href="/booking">Book a session</Link></li>
                </ul>
              </div>
              <div className="col-6 col-lg-3 mb-4 mb-lg-0">
                <h2 className="footer-heading mb-4">Company</h2>
                <ul className="list-unstyled">
                  <li><Link href="/legal/privacy-policy">Privacy policy</Link></li>
                  <li><Link href="/legal/terms">Terms of service</Link></li>
                  <li><Link href="/legal/cookie-policy">Cookie policy</Link></li>
                  <li>
                    <CookieSettingsButton />
                  </li>
                  <li>
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                      Contact us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row pt-5 mt-5">
          <div className="col-12">
            <div className="border-top pt-5 d-flex flex-wrap justify-content-between align-items-center" style={{ gap: 12 }}>
              <p className="mb-0">
                Copyright {new Date().getFullYear()} Nathan Tutors. All rights reserved.
              </p>
              <ul className="list-unstyled mb-0 d-flex flex-wrap" style={{ gap: 18 }}>
                <li>
                  <a href={`tel:+${SITE.whatsapp}`} className="d-inline-flex align-items-center" style={{ gap: 6 }}>
                    <Phone size={14} aria-hidden="true" /> +254 112 272 061
                  </a>
                </li>
                <li>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="d-inline-flex align-items-center" style={{ gap: 6 }}>
                    <MessageCircle size={14} aria-hidden="true" /> WhatsApp
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`} className="d-inline-flex align-items-center" style={{ gap: 6 }}>
                    <Mail size={14} aria-hidden="true" /> Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
