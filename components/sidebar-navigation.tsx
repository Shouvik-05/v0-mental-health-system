"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Home,
  Calendar,
  Users,
  Gamepad2,
  BookOpen,
  MessageCircle,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface User {
  id: string
  email: string
  user_metadata: {
    full_name?: string
  }
}

interface SidebarNavigationProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function SidebarNavigation({ isOpen, setIsOpen }: SidebarNavigationProps) {
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user as User | null)
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user as User | null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      router.push("/auth/login")
    } else {
      router.push("/dashboard")
    }
    setIsOpen(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    setIsOpen(false)
  }

  const navigationItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/booking", icon: Calendar, label: "Book Counselor" },
    { href: "/community", icon: Users, label: "Peer Support" },
    { href: "/games", icon: Gamepad2, label: "Wellness Games" },
    { href: "/resources", icon: BookOpen, label: "Resources" },
    { href: "/ai-support", icon: MessageCircle, label: "AI Support" },
  ]

  return (
    <>
      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg z-40 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
              MindWell
            </h2>
            <p className="text-sm text-gray-600 mt-1">Mental Health Support</p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors",
                  pathname === item.href && "bg-cyan-100 text-cyan-800 font-medium",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}

            {/* Dashboard - Special handling */}
            <button
              onClick={handleDashboardClick}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors",
                pathname === "/dashboard" && "bg-violet-100 text-violet-800 font-medium",
              )}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
              {!user && <span className="text-xs text-gray-500 ml-auto">(Login required)</span>}
            </button>
          </nav>

          {/* User Section */}
          {user ? (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.user_metadata?.full_name?.[0] || user.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="p-4 border-t border-gray-200 space-y-2">
              <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-600 hover:text-cyan-600 hover:bg-cyan-50"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-600 hover:text-violet-600 hover:bg-violet-50"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
