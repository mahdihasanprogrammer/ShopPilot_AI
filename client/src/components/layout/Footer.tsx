import Link from "next/link";
import { RiSparklingFill } from "react-icons/ri";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone } from "react-icons/hi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-footer-bg text-gray-300 border-t border-white/[0.05] mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo & Description */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <RiSparklingFill className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-lg font-black tracking-tight text-transparent">
                ShopPilot AI
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Empowering smart buying flows using modern Generative AI. Explore, compare, and order catalog candidates in one click.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                <FaTwitter className="h-4.5 w-4.5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                <FaLinkedin className="h-4.5 w-4.5" />
              </a>
              <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                <FaGithub className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Platform Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Help Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Contact Info</h3>
            <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
              <li className="flex items-center gap-2">
                <HiOutlineMail className="h-4.5 w-4.5 text-secondary shrink-0" />
                <span>support@shoppilot.ai</span>
              </li>
              <li className="flex items-center gap-2">
                <HiOutlinePhone className="h-4.5 w-4.5 text-secondary shrink-0" />
                <span>+1 (555) 390-1284</span>
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineLocationMarker className="h-4.5 w-4.5 text-secondary shrink-0" />
                <span>Boston, MA 02110, USA</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-medium">
          <p>© {currentYear} ShopPilot AI. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
