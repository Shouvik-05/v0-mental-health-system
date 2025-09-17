"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface SignUpForm {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  age: string
  address: string
  phoneNumber: string
  guardianName: string
  guardianPhone: string
  guardianEmail: string
  course: string
  instituteName: string
}

export default function SignUpPage() {
  const [form, setForm] = useState<SignUpForm>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    age: "",
    address: "",
    phoneNumber: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    course: "",
    instituteName: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: keyof SignUpForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    // Validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (Number.parseInt(form.age) < 13 || Number.parseInt(form.age) > 100) {
      setError("Age must be between 13 and 100")
      setIsLoading(false)
      return
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: form.fullName,
            age: Number.parseInt(form.age),
            address: form.address,
            phone_number: form.phoneNumber,
            guardian_name: form.guardianName,
            guardian_phone: form.guardianPhone,
            guardian_email: form.guardianEmail,
            course: form.course,
            institute_name: form.instituteName,
          },
        },
      })

      if (authError) throw authError
      router.push("/auth/signup-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-violet-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-gray-800">Join MindWell</CardTitle>
            <CardDescription className="text-gray-600">
              Create your account to start your mental wellness journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={form.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={form.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-gray-700">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="13"
                      max="100"
                      required
                      value={form.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-gray-700">
                      Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      required
                      value={form.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      required
                      value={form.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName" className="text-gray-700">
                      Guardian Name
                    </Label>
                    <Input
                      id="guardianName"
                      type="text"
                      required
                      value={form.guardianName}
                      onChange={(e) => handleInputChange("guardianName", e.target.value)}
                      className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone" className="text-gray-700">
                      Guardian Phone
                    </Label>
                    <Input
                      id="guardianPhone"
                      type="tel"
                      required
                      value={form.guardianPhone}
                      onChange={(e) => handleInputChange("guardianPhone", e.target.value)}
                      className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="guardianEmail" className="text-gray-700">
                      Guardian Email
                    </Label>
                    <Input
                      id="guardianEmail"
                      type="email"
                      required
                      value={form.guardianEmail}
                      onChange={(e) => handleInputChange("guardianEmail", e.target.value)}
                      className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course" className="text-gray-700">
                      Course/Program
                    </Label>
                    <Input
                      id="course"
                      type="text"
                      required
                      value={form.course}
                      onChange={(e) => handleInputChange("course", e.target.value)}
                      className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instituteName" className="text-gray-700">
                      Institute Name
                    </Label>
                    <Input
                      id="instituteName"
                      type="text"
                      required
                      value={form.instituteName}
                      onChange={(e) => handleInputChange("instituteName", e.target.value)}
                      className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-medium py-3"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-cyan-600 hover:text-cyan-500 underline underline-offset-4"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
