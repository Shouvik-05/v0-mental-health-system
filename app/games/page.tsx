"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Brain, Heart, Zap, Target, Sparkles, Wind, Play, Trophy, Clock, Star, Users, TrendingUp } from "lucide-react"

const wellnessGames = [
  {
    id: 1,
    title: "Mindful Breathing",
    description: "Guided breathing exercises to reduce stress and anxiety",
    category: "Relaxation",
    duration: "5-10 min",
    difficulty: "Beginner",
    icon: Wind,
    gradient: "from-blue-400 to-cyan-500",
    benefits: ["Reduces anxiety", "Improves focus", "Lowers stress"],
    players: 1247,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Gratitude Garden",
    description: "Plant virtual flowers by expressing daily gratitude",
    category: "Positivity",
    duration: "3-5 min",
    difficulty: "Beginner",
    icon: Heart,
    gradient: "from-pink-400 to-rose-500",
    benefits: ["Boosts mood", "Increases positivity", "Builds resilience"],
    players: 892,
    rating: 4.9,
  },
  {
    id: 3,
    title: "Focus Flow",
    description: "Concentration games to improve attention and mental clarity",
    category: "Cognitive",
    duration: "10-15 min",
    difficulty: "Intermediate",
    icon: Target,
    gradient: "from-purple-400 to-violet-500",
    benefits: ["Enhances focus", "Improves memory", "Builds concentration"],
    players: 634,
    rating: 4.7,
  },
  {
    id: 4,
    title: "Mood Tracker Quest",
    description: "Track emotions through interactive storytelling",
    category: "Self-Awareness",
    duration: "5-8 min",
    difficulty: "Beginner",
    icon: Sparkles,
    gradient: "from-amber-400 to-orange-500",
    benefits: ["Emotional awareness", "Pattern recognition", "Self-reflection"],
    players: 1156,
    rating: 4.6,
  },
  {
    id: 5,
    title: "Stress Buster",
    description: "Quick mini-games to release tension and boost energy",
    category: "Energy",
    duration: "2-5 min",
    difficulty: "Beginner",
    icon: Zap,
    gradient: "from-green-400 to-emerald-500",
    benefits: ["Releases tension", "Boosts energy", "Quick relief"],
    players: 2103,
    rating: 4.5,
  },
  {
    id: 6,
    title: "Memory Palace",
    description: "Build mental strength through memory challenges",
    category: "Cognitive",
    duration: "15-20 min",
    difficulty: "Advanced",
    icon: Brain,
    gradient: "from-indigo-400 to-blue-500",
    benefits: ["Improves memory", "Mental agility", "Cognitive strength"],
    players: 445,
    rating: 4.8,
  },
]

const achievements = [
  { name: "First Steps", description: "Complete your first wellness game", icon: Star, unlocked: true },
  { name: "Consistent Player", description: "Play games for 7 days in a row", icon: Trophy, unlocked: true },
  { name: "Mindful Master", description: "Complete 50 breathing exercises", icon: Wind, unlocked: false },
  { name: "Gratitude Guru", description: "Plant 100 gratitude flowers", icon: Heart, unlocked: false },
]

const userStats = {
  gamesPlayed: 23,
  totalTime: "2h 45m",
  streak: 5,
  level: 3,
  progress: 65,
}

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("games")

  const categories = ["all", "Relaxation", "Positivity", "Cognitive", "Self-Awareness", "Energy"]

  const filteredGames =
    selectedCategory === "all" ? wellnessGames : wellnessGames.filter((game) => game.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-violet-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-balance">
            Wellness Games for
            <span className="bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
              {" "}
              Mental Health
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Engage in fun, science-backed activities designed to improve your mental wellbeing and build healthy habits.
          </p>
        </div>

        {/* User Stats Card */}
        <Card className="mb-8 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border-cyan-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">{userStats.gamesPlayed}</div>
                <div className="text-sm text-gray-600">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-600">{userStats.totalTime}</div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{userStats.streak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">Level {userStats.level}</div>
                <div className="text-sm text-gray-600">
                  <Progress value={userStats.progress} className="w-full mt-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Wellness Games
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-cyan-600 hover:bg-cyan-700" : ""}
                >
                  {category === "all" ? "All Games" : category}
                </Button>
              ))}
            </div>

            {/* Games Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => {
                const IconComponent = game.icon
                return (
                  <Card key={game.id} className="hover:shadow-lg transition-all duration-300 group">
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${game.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {game.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {game.rating}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{game.title}</CardTitle>
                      <CardDescription>{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {game.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {game.players.toLocaleString()}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Benefits:</p>
                          <div className="flex flex-wrap gap-1">
                            {game.benefits.map((benefit, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button
                          className={`w-full bg-gradient-to-r ${game.gradient} hover:opacity-90 text-white border-0`}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your Achievements</h2>
              <p className="text-gray-600">Track your progress and unlock new milestones</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon
                return (
                  <Card
                    key={index}
                    className={`${achievement.unlocked ? "bg-gradient-to-r from-cyan-50 to-violet-50 border-cyan-200" : "opacity-60"}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            achievement.unlocked ? "bg-gradient-to-r from-cyan-500 to-violet-500" : "bg-gray-300"
                          }`}
                        >
                          <IconComponent
                            className={`h-6 w-6 ${achievement.unlocked ? "text-white" : "text-gray-500"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          {achievement.unlocked && <Badge className="mt-2 bg-green-100 text-green-800">Unlocked</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Progress Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-600" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Level Progress</span>
                      <span>{userStats.progress}%</span>
                    </div>
                    <Progress value={userStats.progress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-cyan-600">2/4</div>
                      <div className="text-xs text-gray-600">Achievements</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-violet-600">{userStats.streak}</div>
                      <div className="text-xs text-gray-600">Day Streak</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-emerald-600">Level {userStats.level}</div>
                      <div className="text-xs text-gray-600">Current Level</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
