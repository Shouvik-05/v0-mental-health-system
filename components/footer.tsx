import Link from "next/link"
import { Waves, Mail, Phone, MapPin, Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500">
                <Waves className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
                MindWell
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Supporting college students' mental health with AI-powered assistance, professional counseling, wellness
              games, and peer community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                  AI Support Chat
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                  Book Counselor
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                  Wellness Games
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                  Mental Health Resources
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                  Peer Support Groups
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/crisis" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                  Crisis Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>Crisis: 988</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>support@mindwell.edu</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Student Health Center</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600 mt-4 pt-2 border-t border-gray-300">
                <Shield className="h-4 w-4" />
                <Link href="/admin" className="hover:text-cyan-600 transition-colors">
                  Admin Access
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600">
            © 2024 MindWell. All rights reserved. | If you're in crisis, call 988 or go to your nearest emergency room.
          </p>
        </div>
      </div>
    </footer>
  )
}
