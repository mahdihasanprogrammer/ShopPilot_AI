export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-bg-secondary bg-background mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-text-neutral/70">
            © {currentYear} ShopPilot AI. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-text-neutral/70">
            <a href="/about" className="hover:text-primary transition-colors">About Us</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
