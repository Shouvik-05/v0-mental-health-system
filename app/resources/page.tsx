"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  BookOpen,
  Music,
  PenTool,
  Search,
  Filter,
  Clock,
  Eye,
  Heart,
  Share,
  Download,
  Headphones,
  Video,
  FileText,
  MessageCircle,
} from "lucide-react"

const videos = [
  {
    id: 1,
    title: "5-Minute Meditation for Anxiety Relief",
    description: "A quick guided meditation to help calm your mind and reduce anxiety symptoms.",
    duration: "5:23",
    views: "12.5K",
    category: "Meditation",
    thumbnail: "/peaceful-meditation-scene-with-person-sitting-cros.jpg",
    instructor: "Dr. Sarah Chen",
    difficulty: "Beginner",
  },
  {
    id: 2,
    title: "Understanding Depression: Signs and Support",
    description: "Educational video about recognizing depression symptoms and finding help.",
    duration: "15:42",
    views: "8.9K",
    category: "Education",
    thumbnail: "/professional-therapist-in-modern-office-setting-wi.jpg",
    instructor: "Prof. Michael Torres",
    difficulty: "All Levels",
  },
  {
    id: 3,
    title: "Breathing Techniques for Panic Attacks",
    description: "Learn effective breathing exercises to manage panic attacks and anxiety.",
    duration: "8:15",
    views: "15.2K",
    category: "Techniques",
    thumbnail: "/calm-person-demonstrating-breathing-techniques-wit.jpg",
    instructor: "Lisa Rodriguez, LMFT",
    difficulty: "Beginner",
  },
  {
    id: 4,
    title: "Building Resilience in Difficult Times",
    description: "Strategies for developing mental resilience and coping with life challenges.",
    duration: "22:18",
    views: "6.7K",
    category: "Resilience",
    thumbnail: "/strong-tree-weathering-storm-symbolizing-resilienc.jpg",
    instructor: "Dr. James Wilson",
    difficulty: "Intermediate",
  },
]

const articles = [
  {
    id: 1,
    title: "The Science Behind Mindfulness and Mental Health",
    description: "Explore the research-backed benefits of mindfulness practices for psychological wellbeing.",
    readTime: "8 min read",
    category: "Research",
    author: "Dr. Emily Johnson",
    publishDate: "March 10, 2024",
    likes: 234,
    image: "/brain-scan-imagery-with-mindfulness-meditation-res.jpg",
  },
  {
    id: 2,
    title: "Managing Academic Stress: A Student's Guide",
    description: "Practical strategies for handling academic pressure and maintaining mental health in school.",
    readTime: "6 min read",
    category: "Student Life",
    author: "Alex Martinez, M.Ed",
    publishDate: "March 8, 2024",
    likes: 189,
    image: "/calm-student-studying-in-organized-workspace-with-.jpg",
  },
  {
    id: 3,
    title: "Sleep and Mental Health: The Connection You Need to Know",
    description: "Understanding how sleep quality affects your mental wellbeing and tips for better rest.",
    readTime: "10 min read",
    category: "Wellness",
    author: "Dr. Rachel Kim",
    publishDate: "March 5, 2024",
    likes: 156,
    image: "/peaceful-bedroom-scene-with-sleep-hygiene-elements.jpg",
  },
  {
    id: 4,
    title: "Building Healthy Relationships and Social Connections",
    description: "How to nurture meaningful relationships that support your mental health journey.",
    readTime: "12 min read",
    category: "Relationships",
    author: "Sarah Thompson, LCSW",
    publishDate: "March 3, 2024",
    likes: 298,
    image: "/diverse-group-of-people-connecting-and-supporting-.jpg",
  },
]

const musicPlaylists = [
  {
    id: 1,
    title: "Calm & Focus",
    description: "Ambient sounds and gentle melodies to help you concentrate and stay calm.",
    duration: "2h 15m",
    tracks: 28,
    category: "Focus",
    mood: "Peaceful",
    image: "/serene-nature-scene-with-sound-waves-and-musical-n.jpg",
  },
  {
    id: 2,
    title: "Anxiety Relief",
    description: "Soothing music specifically curated to help reduce anxiety and promote relaxation.",
    duration: "1h 45m",
    tracks: 22,
    category: "Relaxation",
    mood: "Calming",
    image: "/soft-pastel-colors-with-gentle-waves-and-healing-m.jpg",
  },
  {
    id: 3,
    title: "Motivation & Energy",
    description: "Uplifting tracks to boost your mood and energy when you're feeling down.",
    duration: "1h 30m",
    tracks: 20,
    category: "Motivation",
    mood: "Uplifting",
    image: "/vibrant-sunrise-with-energetic-musical-notes-and-u.jpg",
  },
  {
    id: 4,
    title: "Sleep & Dreams",
    description: "Gentle soundscapes and soft melodies to help you unwind and fall asleep.",
    duration: "3h 20m",
    tracks: 35,
    category: "Sleep",
    mood: "Dreamy",
    image: "/dreamy-nighttime-scene-with-stars-moon-and-soft-mu.jpg",
  },
]

const blogPosts = [
  {
    id: 1,
    title: "My Journey with Social Anxiety: What I Learned",
    description: "A personal story about overcoming social anxiety and finding confidence.",
    author: "Jamie Chen",
    publishDate: "March 12, 2024",
    readTime: "7 min read",
    category: "Personal Story",
    likes: 145,
    comments: 23,
  },
  {
    id: 2,
    title: "Finding Hope After Depression: A Recovery Story",
    description: "One student's path through depression and the strategies that helped them heal.",
    author: "Alex Rivera",
    publishDate: "March 9, 2024",
    readTime: "9 min read",
    category: "Recovery",
    likes: 267,
    comments: 41,
  },
  {
    id: 3,
    title: "The Power of Therapy: Why I Finally Decided to Go",
    description: "Breaking the stigma and sharing the positive impact of seeking professional help.",
    author: "Morgan Taylor",
    publishDate: "March 6, 2024",
    readTime: "5 min read",
    category: "Therapy",
    likes: 198,
    comments: 32,
  },
  {
    id: 4,
    title: "Mindfulness in Daily Life: Small Changes, Big Impact",
    description: "How incorporating mindfulness into everyday activities transformed my mental health.",
    author: "Sam Johnson",
    publishDate: "March 4, 2024",
    readTime: "6 min read",
    category: "Mindfulness",
    likes: 176,
    comments: 18,
  },
]

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("videos")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-violet-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-balance">
            Mental Health
            <span className="bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
              {" "}
              Resources & Support
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Discover videos, articles, music, and personal stories to support your mental health journey and inspire
            positive change.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 h-12 text-lg"
            />
            <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Music
            </TabsTrigger>
            <TabsTrigger value="blogs" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Blogs
            </TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-t-lg group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Button size="lg" className="bg-white/90 hover:bg-white text-gray-900">
                        <Play className="h-5 w-5 mr-2" />
                        Play
                      </Button>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-black/70 text-white">{video.duration}</Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{video.category}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        {video.views}
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>by {video.instructor}</span>
                      <Badge variant="outline" className="text-xs">
                        {video.difficulty}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {article.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>by {article.author}</span>
                      <span>{article.publishDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Heart className="h-4 w-4" />
                        {article.likes}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <BookOpen className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Music Tab */}
          <TabsContent value="music" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {musicPlaylists.map((playlist) => (
                <Card key={playlist.id} className="hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <img
                      src={playlist.image || "/placeholder.svg"}
                      alt={playlist.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-t-lg group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Button size="lg" className="bg-white/90 hover:bg-white text-gray-900">
                        <Play className="h-5 w-5 mr-2" />
                        Play
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{playlist.category}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {playlist.mood}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{playlist.title}</CardTitle>
                    <CardDescription>{playlist.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>{playlist.tracks} tracks</span>
                      <span>{playlist.duration}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 text-white">
                        <Headphones className="h-4 w-4 mr-2" />
                        Listen
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Blogs Tab */}
          <TabsContent value="blogs" className="space-y-6">
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{post.category}</Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-3">{post.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span>by {post.author}</span>
                            <span>{post.publishDate}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {post.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {post.comments}
                            </div>
                          </div>
                        </div>
                      </div>
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
