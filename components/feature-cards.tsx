import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Calendar, BookOpen, Users, AlertTriangle, Heart } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: MessageCircle,
    title: "AI Chat Support",
    description:
      "Get immediate support through our AI-powered chatbot trained to provide mental health guidance and coping strategies.",
    href: "/auth/login",
    buttonText: "Start Chatting",
    color: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    icon: Calendar,
    title: "Counselor Booking",
    description:
      "Schedule confidential sessions with licensed mental health professionals who understand student challenges.",
    href: "/auth/login",
    buttonText: "Book Session",
    color: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description:
      "Access videos, articles, and guides on stress management, anxiety relief, and wellness in multiple languages.",
    href: "/auth/login",
    buttonText: "Explore Resources",
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Users,
    title: "Peer Support Groups",
    description:
      'Connect anonymously with other students in themed support groups like "Exam Stress" and "Loneliness Lounge".',
    href: "/auth/login",
    buttonText: "Join Community",
    color: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    icon: AlertTriangle,
    title: "Crisis Support",
    description: "Emergency SOS button for immediate help with crisis hotlines and trusted contact notifications.",
    href: "/auth/login",
    buttonText: "Learn More",
    color: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    icon: Heart,
    title: "Wellness Tracking",
    description:
      "Monitor your emotional well-being with mood tracking and receive personalized insights and recommendations.",
    href: "/auth/login",
    buttonText: "Track Wellness",
    color: "bg-pink-100",
    iconColor: "text-pink-600",
  },
]

export function FeatureCards() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-balance">
            Comprehensive Mental Health Support
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty leading-relaxed">
            Everything you need to support your mental health journey, from immediate AI assistance to professional
            counseling and peer connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl text-gray-800">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    variant="outline"
                    className="w-full bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-gray-50"
                    asChild
                  >
                    <Link href={feature.href}>{feature.buttonText}</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
