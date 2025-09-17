"use client"

import type React from "react"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { useState } from "react"

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <SidebarNavigation isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>{children}</div>
    </>
  )
}
