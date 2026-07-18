"use client";

import { RiSparklingFill, RiRobot2Line, RiInformationLine } from "react-icons/ri";

interface AISummaryCardProps {
  title: string;
  category: string;
}

export default function AISummaryCard({ title, category }: AISummaryCardProps) {
  // Generate a dynamic placeholder AI summary based on the product title and category
  const getAISummary = () => {
    return `ShopPilot AI analysis shows that the "${title}" is a highly rated product in the ${category} category. Customers praise its premium design, robust build quality, and ease of use. It stands out as a top-tier option for shoppers prioritizing value, comfort, and reliability in their daily setups.`;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-background p-6 shadow-sm">
      {/* Glow spots */}
      <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-primary/10 blur-xl" />
      
      <div className="space-y-4 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-bg-secondary/40 pb-3">
          <div className="flex items-center gap-1.5">
            <RiSparklingFill className="h-4.5 w-4.5 text-primary animate-pulse" />
            <h3 className="text-sm font-bold text-text-neutral">AI Summary Guide</h3>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
            <RiRobot2Line className="h-3 w-3" />
            ShopPilot AI Summarized
          </span>
        </div>

        <p className="text-xs text-text-neutral/80 leading-relaxed font-medium">
          {getAISummary()}
        </p>

        <div className="flex items-start gap-1 text-[10px] text-text-neutral/45 bg-bg-secondary/20 rounded-xl p-2.5">
          <RiInformationLine className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
          <p className="leading-relaxed">
            This card will be dynamically wired to real-time Claude API models in Prompt 14, reading the full description and customer reviews to compile instant, objective buyer insights.
          </p>
        </div>
      </div>
    </div>
  );
}
