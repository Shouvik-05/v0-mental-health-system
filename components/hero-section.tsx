import { Button } from "@/components/ui/button"
import { MessageCircle, Calendar, Users, Shield } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 text-balance">
            Your Wellness Journey{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            MindWell provides a safe, confidential space for college students to access mental health support through
            AI-powered conversations, professional counseling, wellness games, and peer community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="text-lg px-8 py-3 !bg-slate-800 hover:!bg-slate-900 !text-white !font-medium !shadow-lg !border-0"
              asChild
            >
              <Link href="/auth/login">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start AI Chat
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 !bg-white !border-2 !border-slate-800 !text-slate-800 hover:!bg-slate-50 !font-medium !shadow-md bg-transparent"
              asChild
            >
              <Link href="/auth/login">
                <Calendar className="mr-2 h-5 w-5" />
                Book Counselor
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-cyan-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">100% Confidential</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-2">
                <MessageCircle className="h-6 w-6 text-violet-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">24/7 AI Support</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Peer Community</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Licensed Counselors</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
