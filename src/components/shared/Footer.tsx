import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import footerMainLogo from "../../assets/footer-main-logo.png";

export default function Footer() {
  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "City Services", href: "/city-services" },
  ];

  const supportLinks = [
    { label: "FAQ", href: "/faq" },
    { label: "Cancellation Policy", href: "/cancellation" },
    { label: "Blog", href: "/blog" },
  ];

  const legalLinks = [
    { label: "Platform Policies", href: "/policies" },
    { label: "Impressum & GDPR", href: "/impressum" },
    { label: "Buy Leads", href: "/buy-leads" },
  ];

  return (
    <footer className="bg-[#000000] text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-start gap-3">
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  style={{
                    width: "44px",
                    height: "34px",
                  }}
                  width={44}
                  height={34}
                  src={footerMainLogo}
                  alt="Handy Connect logo"
                />
                <span className="text-xl font-bold tracking-tight">Handy Connect</span>
              </Link>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Connecting homeowners with trusted, verified service professionals for all
              your home maintenance and repair needs.
            </p>
            <div className="flex gap-6 text-gray-400">
              <FaTwitter className="cursor-pointer hover:text-white transition-colors text-lg" />
              <FaFacebookF className="cursor-pointer hover:text-white transition-colors text-lg" />
              <FaInstagram className="cursor-pointer hover:text-white transition-colors text-lg" />
              <FaLinkedinIn className="cursor-pointer hover:text-white transition-colors text-lg" />
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-6">Support</h3>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold mb-6">Legal &amp; Pros</h3>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/60 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs tracking-wide">
          <p>© 2026 Handy Connect Inc. All rights reserved.</p>
          <div className="flex items-center gap-8 mt-4 md:mt-0">
            <button className="hover:text-white transition-colors">English (US)</button>
            <button className="hover:text-white transition-colors">€ EUR</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
