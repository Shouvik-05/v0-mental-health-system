import { HeroSection } from "@/components/hero-section"
import { FeatureCards } from "@/components/feature-cards"
import { GamesSection } from "@/components/games-section"
import { QuickActions } from "@/components/quick-actions"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-violet-50">
      <main>
        <HeroSection />
        <FeatureCards />
        <GamesSection />
        <QuickActions />
      </main>
      <Footer />
    </div>
  )
}
