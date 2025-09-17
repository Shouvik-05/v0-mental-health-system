import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Heart, Zap, Target, Smile, Sparkles } from "lucide-react"
import Link from "next/link"

export function GamesSection() {
  const games = [
    {
      id: "breathing",
      title: "Mindful Breathing",
      description: "Guided breathing exercises to reduce anxiety and promote calm",
      icon: Heart,
      color: "from-rose-400 to-pink-500",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
      difficulty: "Beginner",
      duration: "5-10 min",
    },
    {
      id: "memory",
      title: "Memory Palace",
      description: "Cognitive training games to improve focus and memory",
      icon: Brain,
      color: "from-purple-400 to-violet-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      difficulty: "Intermediate",
      duration: "10-15 min",
    },
    {
      id: "mood",
      title: "Mood Tracker",
      description: "Interactive mood tracking with personalized insights",
      icon: Smile,
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      difficulty: "Beginner",
      duration: "3-5 min",
    },
    {
      id: "energy",
      title: "Energy Boost",
      description: "Quick activities to increase motivation and energy levels",
      icon: Zap,
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      difficulty: "Beginner",
      duration: "5-8 min",
    },
    {
      id: "focus",
      title: "Focus Challenge",
      description: "Concentration exercises to improve attention span",
      icon: Target,
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      difficulty: "Advanced",
      duration: "15-20 min",
    },
    {
      id: "gratitude",
      title: "Gratitude Garden",
      description: "Build a virtual garden while practicing gratitude",
      icon: Sparkles,
      color: "from-teal-400 to-cyan-500",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
      difficulty: "Beginner",
      duration: "8-12 min",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-balance">
            Wellness Games & Activities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty leading-relaxed">
            Engage in fun, science-backed activities designed to improve your mental wellness and build healthy habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {games.map((game) => {
            const IconComponent = game.icon
            return (
              <Card
                key={game.id}
                className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-16 h-16 ${game.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`h-8 w-8 ${game.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-gray-900">
                    {game.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">{game.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">{game.difficulty}</span>
                    <span className="text-sm text-gray-500">{game.duration}</span>
                  </div>
                  <Button
                    className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white font-medium`}
                    asChild
                  >
                    <Link href={`/games/${game.id}`}>Start Activity</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-3 bg-white/80 backdrop-blur-sm border-cyan-200 text-cyan-700 hover:bg-cyan-50"
            asChild
          >
            <Link href="/games">View All Activities</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
