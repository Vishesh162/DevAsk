import { HeroParallax } from "@/components/ui/hero-parallax";
import HeroSection from "./components/HeroSection";
import HeroSectionHeader from "./components/HeroSectionHeader";
import LatestQuestions from "./components/LatestQuestions";
import TopContributers from "./components/TopContributers";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { 
    AnimatedStatsBar, 
    AnimatedDivider, 
    AnimatedSectionHeading, 
    AnimatedCards 
} from "./components/AnimatedSections";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Dynamic Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />

      {/* Hero Section */}
      <section className="relative z-10 w-full py-12 md:py-24">
        <HeroSection />
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 w-full py-8 mt-4">
          <AnimatedStatsBar />
      </section>

      <AnimatedDivider />

      {/* Community Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto py-16 px-4">
        <AnimatedSectionHeading />
        
        <AnimatedCards 
            latestQuestions={<LatestQuestions />}
            topContributers={<TopContributers />}
        />
      </section>
    </main>
  );
}