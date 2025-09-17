"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageCircle, Heart, Calendar, MapPin, Clock, Plus, Search, Filter } from "lucide-react"

const supportGroups = [
  {
    id: 1,
    name: "Anxiety Support Circle",
    description: "A safe space to share experiences and coping strategies for anxiety management.",
    members: 24,
    category: "Anxiety",
    nextMeeting: "Today, 7:00 PM",
    isOnline: true,
  },
  {
    id: 2,
    name: "Student Stress Relief",
    description: "Connect with fellow students dealing with academic pressure and life transitions.",
    members: 18,
    category: "Academic",
    nextMeeting: "Tomorrow, 6:00 PM",
    isOnline: true,
  },
  {
    id: 3,
    name: "Mindfulness & Meditation",
    description: "Practice mindfulness together and share meditation techniques.",
    members: 32,
    category: "Wellness",
    nextMeeting: "Wed, 5:30 PM",
    isOnline: false,
    location: "Campus Wellness Center",
  },
  {
    id: 4,
    name: "Depression Support Network",
    description: "Understanding and supporting each other through difficult times.",
    members: 15,
    category: "Depression",
    nextMeeting: "Thu, 7:30 PM",
    isOnline: true,
  },
]

const forumPosts = [
  {
    id: 1,
    title: "Tips for managing exam anxiety?",
    author: "Sarah M.",
    avatar: "/student-avatar-1.png",
    category: "Academic",
    replies: 12,
    likes: 8,
    timeAgo: "2 hours ago",
    preview: "Finals are coming up and I'm feeling overwhelmed. What strategies have worked for you?",
  },
  {
    id: 2,
    title: "Celebrating small wins today",
    author: "Alex K.",
    avatar: "/student-avatar-2.png",
    category: "Wellness",
    replies: 6,
    likes: 15,
    timeAgo: "4 hours ago",
    preview: "Got out of bed early, had a healthy breakfast, and attended my first class in weeks!",
  },
  {
    id: 3,
    title: "Breathing exercises that actually work",
    author: "Jordan L.",
    avatar: "/student-avatar-3.png",
    category: "Anxiety",
    replies: 9,
    likes: 22,
    timeAgo: "1 day ago",
    preview: "Sharing some breathing techniques that have helped me during panic attacks...",
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Mental Health Awareness Workshop",
    date: "March 15, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "Student Center, Room 201",
    attendees: 45,
  },
  {
    id: 2,
    title: "Stress-Free Study Session",
    date: "March 18, 2024",
    time: "6:00 PM - 8:00 PM",
    location: "Library Study Hall",
    attendees: 28,
  },
  {
    id: 3,
    title: "Peer Support Training",
    date: "March 22, 2024",
    time: "10:00 AM - 12:00 PM",
    location: "Online via Zoom",
    attendees: 12,
  },
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("groups")

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-violet-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-balance">
            Connect with Your
            <span className="bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
              {" "}
              Peer Support Community
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Join support groups, participate in discussions, and connect with others who understand your journey.
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Support Groups
            </TabsTrigger>
            <TabsTrigger value="forum" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Community Forum
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
          </TabsList>

          {/* Support Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search support groups..." className="pl-10" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Button className="bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {supportGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-2">{group.name}</CardTitle>
                        <Badge variant="secondary" className="mb-2">
                          {group.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        {group.members}
                      </div>
                    </div>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Next meeting: {group.nextMeeting}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {group.isOnline ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Online Meeting</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4" />
                            <span>{group.location}</span>
                          </>
                        )}
                      </div>
                      <Button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white">Join Group</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Community Forum Tab */}
          <TabsContent value="forum" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search discussions..." className="pl-10" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Button className="bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>

            <div className="space-y-4">
              {forumPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.author} />
                        <AvatarFallback>
                          {post.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{post.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{post.preview}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>by {post.author}</span>
                          <span>{post.timeAgo}</span>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {post.replies}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {post.likes}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Upcoming Events</h2>
              <Button className="bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees} attending</span>
                      </div>
                      <Button className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white">Join Event</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
