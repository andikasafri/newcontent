import { Facebook, Twitter, Youtube } from "lucide-react";

interface SocialLink {
  icon: typeof Facebook | typeof Twitter | typeof Youtube;
  href: string;
  label: string;
}

interface QuickLink {
  label: string;
  href: string;
}

/**
 * Footer component with social links and quick navigation
 * Displays company information, quick links, and social media icons
 *
 * @component
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks: SocialLink[] = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const quickLinks: QuickLink[] = [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              ShopHub
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your one-stop destination for quality products and exceptional
              shopping experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-2">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900
                     dark:hover:text-gray-100 transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400">
              © {currentYear} ShopHub. All rights reserved.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900
                   dark:hover:text-gray-100 transition-colors duration-200"
                  aria-label={label}
                  rel="noopener noreferrer"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
