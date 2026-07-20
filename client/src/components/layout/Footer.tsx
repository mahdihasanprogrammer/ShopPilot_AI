import Link from "next/link";
import { RiSparklingFill } from "react-icons/ri";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const categoriesList = [
    { name: "Electronics", slug: "Electronics" },
    { name: "Fashion", slug: "Fashion" },
    { name: "Home & Kitchen", slug: "Home & Kitchen" },
    { name: "Sports", slug: "Sports" },
    { name: "Books", slug: "Books" },
    { name: "Beauty", slug: "Beauty" },
  ];

  return (
    <footer className="bg-footer-bg text-gray-300 border-t border-white/[0.08] mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Logo & Description */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md">
                <RiSparklingFill className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-lg font-black tracking-tight text-transparent">
                ShopPilot AI
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">
              Empowering smart buying flows using modern Generative AI. Explore, compare, and order catalog candidates in one click.
            </p>
            
            {/* High-contrast Social Links */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.facebook.com/hasan.shardar.1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/mahdi-hasan-web"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/mahdihasanprogrammer"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <FaGithub className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-primary/20 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3 text-xs font-semibold">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-primary/20 pb-2">
              Categories
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs font-semibold">
              {categoriesList.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/products?category=${cat.slug}`}
                  className="text-gray-400 hover:text-white transition-colors truncate cursor-pointer"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-semibold">
          <p>© {currentYear} ShopPilot AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-white/10">|</span>
            <Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
