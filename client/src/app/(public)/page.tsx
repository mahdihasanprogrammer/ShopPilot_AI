import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import AIAssistantHighlight from "@/components/home/AIAssistantHighlight";
import Newsletter from "@/components/home/Newsletter";
import RecommendationsSection from "@/components/shared/RecommendationsSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. Hero Section (60-70% Viewport Height, CTA + Sandbox Chat Preview) */}
      <Hero />

      {/* 2. Categories Section (6 curations grids) */}
      <Categories />

      {/* 3. Featured Products Section (8 items, 4-col responsive grid with loading skeletons) */}
      <FeaturedProducts />

      {/* AI Recommendation Engine */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-black/[0.04]">
        <RecommendationsSection />
      </div>

      {/* 4. Why Choose Us Section (4 value cards) */}
      <WhyChooseUs />

      {/* 5. Testimonials Section (3 feedback review cards) */}
      <Testimonials />

      {/* 6. AI Assistant Site-Wide Feature Highlight Banner */}
      <AIAssistantHighlight />

      {/* 7. Interactive Newsletter Subscription Box */}
      <Newsletter />
    </div>
  );
}
