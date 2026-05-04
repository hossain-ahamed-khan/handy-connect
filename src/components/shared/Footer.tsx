import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaWrench,
} from "react-icons/fa";
import main_logo from "../../assets/main_logo.svg";

export default function Footer() {
  const popularServices = [
    { label: "Plumbing Repair", href: "/plumbing" },
    { label: "Electrical Work", href: "/electrical" },
    { label: "HVAC Maintenance", href: "/hvac" },
    { label: "House Painting", href: "/painting" },
    { label: "Moving Services", href: "/moving" },
    { label: "Gardening & Landscaping", href: "/gardening" },
  ];

  const supportLinks = [
    { label: "Help Center", href: "/help" },
    { label: "Safety Information", href: "/safety" },
    { label: "Cancellation Options", href: "/cancellation" },
    { label: "Contact Us", href: "/contact" },
  ];

  const legalLinks = [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Provider Agreement", href: "/provider-agreement" },
  ];

  return (
    <footer className="bg-[#000000] text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Section - Spans 4 columns for balance */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-start gap-3">
              <Link href="/">
                <Image
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                  width={500}
                  height={300}
                  src={main_logo}
                  alt="main_logo"
                />
                <h1 className="text-xl font-bold tracking-tight">Handy Connect</h1>
              </Link>

            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Connecting homeowners with trusted, verified service professionals
              for all your home maintenance and repair needs.
            </p>
            <div className="flex gap-6 text-gray-400">
              <FaTwitter className="cursor-pointer hover:text-white transition-colors text-lg" />
              <FaFacebookF className="cursor-pointer hover:text-white transition-colors text-lg" />
              <FaInstagram className="cursor-pointer hover:text-white transition-colors text-lg" />
              <FaLinkedinIn className="cursor-pointer hover:text-white transition-colors text-lg" />
            </div>
          </div>

          {/* Popular Services - Spans 3 columns */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold mb-6">Popular Services</h3>
            <ul className="space-y-4">
              {popularServices.map((link) => (
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

          {/* Support - Spans 2 columns */}
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

          {/* Legal - Spans 3 columns */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold mb-6">Legal</h3>
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

        {/* Divider & Bottom Copyright Section */}
        <div className="border-t border-gray-800/60 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs tracking-wide">
          <p>© 2026 Handy Connect Inc. All rights reserved.</p>
          <div className="flex items-center gap-8 mt-4 md:mt-0">
            <button className="hover:text-white transition-colors">
              English (US)
            </button>
            <button className="hover:text-white transition-colors">
              € EUR
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
