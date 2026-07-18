import Link from "next/link";
import { RiSparklingFill } from "react-icons/ri";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-bg-secondary bg-background mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <Link href="/" className="flex items-center gap-1.5">
              <RiSparklingFill className="h-4 w-4 text-primary" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text font-bold text-transparent">
                ShopPilot AI
              </span>
            </Link>
            <p className="text-xs text-text-neutral/50">
              © {currentYear} ShopPilot AI. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm text-text-neutral/70">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="flex items-center gap-1 hover:text-primary transition-colors">
              <HiOutlineMail className="h-4 w-4" /> Contact
            </Link>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3 text-text-neutral/50">
            <a href="#" aria-label="GitHub" className="hover:text-primary transition-colors">
              <FaGithub className="h-4 w-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-primary transition-colors">
              <FaLinkedin className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors">
              <FaTwitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
