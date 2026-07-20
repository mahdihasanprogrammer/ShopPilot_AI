import Link from "next/link";
import { RiSparklingFill } from "react-icons/ri";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { FiMail, FiMapPin, FiPackage, FiInfo, FiPhone } from "react-icons/fi";
import { MdSecurity, MdLocalShipping } from "react-icons/md";

const footerLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "New Arrivals",  href: "/products?sort=createdAt:desc" },
    { label: "Top Rated",    href: "/products?sort=rating:desc" },
  ],
  company: [
    { label: "About Us",  href: "/about" },
    { label: "Contact",   href: "/contact" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
  support: [
    { label: "Help Center",      href: "#" },
    { label: "Shipping Policy",  href: "#" },
    { label: "Returns",          href: "#" },
    { label: "Order Tracking",   href: "#" },
  ],
};

const social = [
  { icon: FaGithub,    label: "GitHub",    href: "#" },
  { icon: FaLinkedin,  label: "LinkedIn",  href: "#" },
  { icon: FaTwitter,   label: "Twitter",   href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
];

const features = [
  { icon: MdLocalShipping, label: "Free shipping over $75" },
  { icon: MdSecurity,      label: "Secure checkout" },
  { icon: FiPackage,       label: "Easy returns" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--footer-bg)" }} className="mt-auto text-white/70">

      {/* ── Feature Strip ── */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm font-medium">
                <Icon className="h-5 w-5 text-secondary shrink-0" style={{ color: "var(--secondary)" }} />
                <span className="text-white/80">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
              >
                <RiSparklingFill className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Shop<span style={{ color: "var(--primary-light)" }}>Pilot</span>
                <span style={{ color: "var(--secondary-light, #CCFBF1)" }}> AI</span>
              </span>
            </Link>
            <p className="text-sm text-white/55 leading-relaxed max-w-xs">
              Your AI-powered shopping companion. Discover products, get smart recommendations, and shop with confidence.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {social.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/55 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-secondary transition-all duration-200 shrink-0" style={{ background: "var(--secondary)" }} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/55 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px transition-all duration-200 shrink-0" style={{ background: "var(--secondary)" }} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support + Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/55 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px transition-all duration-200 shrink-0" style={{ background: "var(--secondary)" }} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact info */}
            <div className="pt-2 space-y-2">
              <a
                href="mailto:hello@shoppilot.ai"
                className="flex items-center gap-2 text-xs text-white/50 hover:text-white/80 transition-colors"
              >
                <FiMail className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--secondary)" }} />
                hello@shoppilot.ai
              </a>
              <span className="flex items-center gap-2 text-xs text-white/50">
                <FiMapPin className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--secondary)" }} />
                Dhaka, Bangladesh
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40 text-center sm:text-left">
            © {currentYear} ShopPilot AI. All rights reserved. Built with ❤️ by Mahdi Hasan.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">Privacy</Link>
            <Link href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">Terms</Link>
            <Link href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
