import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-background to-bg-secondary">
      <div className="max-w-3xl space-y-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          ✨ Introducing ShopPilot AI
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-text-neutral">
          The AI-Powered E-Commerce{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Shopping Assistant
          </span>
        </h1>
        <p className="text-lg text-text-neutral/70 max-w-xl mx-auto">
          Explore products with conversational AI. Get intelligent recommendations tailored specifically for you.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/products"
            className="rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark transition-all shadow-md hover:shadow-lg"
          >
            Explore Products
          </Link>
          <Link
            href="/about"
            className="rounded-xl border border-bg-secondary bg-background px-6 py-3 font-semibold text-text-neutral hover:bg-bg-secondary transition-all"
          >
            Learn More
          </Link>
        </div>
      </div>
    </main>
  );
}
