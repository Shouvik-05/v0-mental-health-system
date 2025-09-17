"use client"

import type React from "react"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, Star } from "lucide-react"

const counselors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    rating: 4.9,
    experience: "8 years",
    image: "/professional-female-therapist.png",
    bio: "Specializes in cognitive behavioral therapy and mindfulness-based approaches.",
    availability: ["Monday", "Wednesday", "Friday"],
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Stress Management",
    rating: 4.8,
    experience: "12 years",
    image: "/male-therapist.png",
    bio: "Expert in stress reduction techniques and work-life balance counseling.",
    availability: ["Tuesday", "Thursday", "Saturday"],
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Student Counseling",
    rating: 4.9,
    experience: "6 years",
    image: "/professional-female-counselor.jpg",
    bio: "Focuses on academic stress, social anxiety, and personal development for students.",
    availability: ["Monday", "Tuesday", "Thursday"],
  },
]

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

export default function BookingPage() {
  const [selectedCounselor, setSelectedCounselor] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [bookingStep, setBookingStep] = useState(1)

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle booking submission
    alert("Booking request submitted! You will receive a confirmation email shortly.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-violet-50">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-balance">
            Book a Session with Our
            <span className="bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
              {" "}
              Professional Counselors
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Connect with licensed mental health professionals who understand your needs and can provide personalized
            support.
          </p>
        </div>

        {bookingStep === 1 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose Your Counselor</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {counselors.map((counselor) => (
                <Card
                  key={counselor.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCounselor === counselor.id ? "ring-2 ring-cyan-500 shadow-lg" : ""
                  }`}
                  onClick={() => setSelectedCounselor(counselor.id)}
                >
                  <CardHeader className="text-center">
                    <img
                      src={counselor.image || "/placeholder.svg"}
                      alt={counselor.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <CardTitle className="text-lg">{counselor.name}</CardTitle>
                    <CardDescription className="text-cyan-600 font-medium">{counselor.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{counselor.rating} rating</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{counselor.experience} experience</span>
                      </div>
                      <p className="text-gray-700 mt-3">{counselor.bio}</p>
                      <div className="mt-3">
                        <p className="font-medium text-gray-700">Available:</p>
                        <p className="text-cyan-600">{counselor.availability.join(", ")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                onClick={() => setBookingStep(2)}
                disabled={!selectedCounselor}
                className="bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 text-white px-8 py-3"
              >
                Continue to Scheduling
              </Button>
            </div>
          </div>
        )}

        {bookingStep === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={() => setBookingStep(1)} className="text-cyan-600">
                ← Back to Counselors
              </Button>
              <h2 className="text-2xl font-semibold text-gray-900">Schedule Your Session</h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-cyan-600" />
                  Book with {counselors.find((c) => c.id === selectedCounselor)?.name}
                </CardTitle>
                <CardDescription>{counselors.find((c) => c.id === selectedCounselor)?.specialty}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Preferred Time</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime} required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" required className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="session-type">Session Type</Label>
                    <Select required>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select session type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="in-person">In-Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="concerns">What would you like to discuss? (Optional)</Label>
                    <Textarea
                      id="concerns"
                      placeholder="Share any specific concerns or topics you'd like to address..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>

                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Session Details</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>• Duration: 50 minutes</p>
                      <p>• Cost: ₹6,650 per session</p>
                      <p>• Cancellation: Free up to 24 hours before</p>
                      <p>• Insurance: We accept most major insurance plans</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 text-white py-3"
                  >
                    Book Session
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
