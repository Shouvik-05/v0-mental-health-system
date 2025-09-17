"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Bot, User, AlertTriangle, Heart, Phone, MessageSquare } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatSession {
  id: string
  is_active: boolean
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize chat session
  useEffect(() => {
    initializeChatSession()
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const initializeChatSession = async () => {
    try {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        is_active: true,
      }

      setCurrentSession(newSession)
      setIsConnected(true)

      // Add welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        content:
          "Hello! I'm your AI mental health assistant. I'm here to provide support, coping strategies, and a safe space to talk about what's on your mind. How are you feeling today?",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages([welcomeMessage])
    } catch (error) {
      console.error("Failed to initialize chat session:", error)
      setIsConnected(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentSession || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await simulateAIResponse(inputValue)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])

      // Show crisis alert if needed
      if (response.showCrisisAlert) {
        setShowCrisisAlert(true)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or if this is urgent, please contact the crisis hotline at 988.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const simulateAIResponse = async (userMessage: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

    const lowerMessage = userMessage.toLowerCase()
    let response = ""
    let showCrisisAlert = false

    // Generate contextual responses
    if (
      lowerMessage.includes("suicide") ||
      lowerMessage.includes("kill myself") ||
      lowerMessage.includes("end it all") ||
      lowerMessage.includes("want to die")
    ) {
      response =
        "I'm very concerned about what you've shared, and I want you to know that your life has immense value. You're not alone in this pain, and there are people trained to help you through this difficult time. Please reach out to the crisis hotline at 988 immediately, or go to your nearest emergency room. Would you like me to help you find local crisis resources?"
      showCrisisAlert = true
    } else if (lowerMessage.includes("exam") || lowerMessage.includes("test") || lowerMessage.includes("study")) {
      response =
        "Exam stress is incredibly common - you're definitely not alone in feeling this way. It sounds overwhelming right now. Let's try a quick grounding technique: take a deep breath in for 4 counts, hold for 4, then slowly out for 6. This activates your body's relaxation response. Would you like some specific study strategies that can help reduce anxiety, or would you prefer to talk about what's making the exams feel so stressful?"
    } else if (lowerMessage.includes("lonely") || lowerMessage.includes("alone") || lowerMessage.includes("isolated")) {
      response =
        "Loneliness can feel so heavy, especially when it seems like everyone else is connected. What you're feeling is valid and more common than you might think. Many students experience this, particularly during stressful times. Have you considered joining our peer support groups? Sometimes just knowing others understand can make a real difference. What kind of connection feels most missing for you right now?"
    } else if (
      lowerMessage.includes("anxious") ||
      lowerMessage.includes("anxiety") ||
      lowerMessage.includes("worried")
    ) {
      response =
        "Anxiety can feel overwhelming, like your mind is racing and you can't catch your breath. Right now, let's try the 5-4-3-2-1 grounding technique: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This helps anchor you in the present moment. What tends to trigger your anxiety the most?"
    } else if (lowerMessage.includes("sleep") || lowerMessage.includes("tired") || lowerMessage.includes("insomnia")) {
      response =
        "Sleep struggles often go hand-in-hand with stress and mental health challenges - it's like a cycle that feeds itself. Good sleep hygiene can be a game-changer. Try keeping consistent sleep/wake times, creating a wind-down routine 30 minutes before bed, and avoiding screens during that time. Are you having trouble falling asleep, staying asleep, or both? Understanding the pattern can help us find the right strategies."
    } else if (
      lowerMessage.includes("depressed") ||
      lowerMessage.includes("sad") ||
      lowerMessage.includes("hopeless")
    ) {
      response =
        "I hear the pain in what you're sharing, and I want you to know that these feelings, while incredibly difficult, are temporary. Depression can make everything feel gray and hopeless, but you've taken a brave step by reaching out. Small steps can make a difference - even just talking about it here shows strength. What has been the hardest part of your day today?"
    } else if (lowerMessage.includes("family") || lowerMessage.includes("parents") || lowerMessage.includes("home")) {
      response =
        "Family relationships can be complex and emotionally charged, especially when you're dealing with your own stress. It's normal for family dynamics to feel more challenging during difficult times. Sometimes families want to help but don't know how, or their way of helping doesn't match what you need. What's been the most difficult part of your family situation lately?"
    } else if (
      lowerMessage.includes("friend") ||
      lowerMessage.includes("relationship") ||
      lowerMessage.includes("social")
    ) {
      response =
        "Relationships with friends can be both a source of support and stress, especially when you're already struggling. It's okay if social situations feel harder right now - that's actually pretty common when we're dealing with mental health challenges. What's been weighing on you most about your friendships or social connections?"
    } else {
      // Default supportive responses with more variety and empathy
      const responses = [
        "Thank you for trusting me with what you're going through. It takes real courage to open up about difficult feelings. I'm here to listen and support you. Can you tell me more about what's been weighing on your mind lately?",
        "I can hear that you're dealing with something challenging right now, and I want you to know that your feelings are completely valid. Sometimes just having a safe space to express what we're going through can help. What's been the most difficult part of your day?",
        "It sounds like you're carrying a lot right now, and that takes strength even when it doesn't feel like it. Everyone faces struggles, and reaching out for support - like you're doing right now - shows real wisdom. What kind of support feels most helpful to you in this moment?",
        "I appreciate you sharing with me, and I want you to know that whatever you're feeling is okay. Mental health challenges are real, and you deserve support and understanding. Would you like to explore some coping strategies together, or would you prefer to talk more about what's been troubling you?",
        "Thank you for being open with me about what you're experiencing. It's completely normal to have difficult days, and you're not alone in this. Sometimes talking through our thoughts and feelings can help us process them better. What's been on your mind the most lately?",
      ]
      response = responses[Math.floor(Math.random() * responses.length)]
    }

    return {
      message: response,
      showCrisisAlert,
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isConnected) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <CardContent className="text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
          <p className="text-muted-foreground mb-4">Unable to connect to the AI assistant. Please try again.</p>
          <Button onClick={initializeChatSession}>Retry Connection</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Crisis Alert */}
      {showCrisisAlert && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>High distress detected. If you're in crisis, please seek immediate help.</span>
            <div className="flex space-x-2 ml-4">
              <Button size="sm" variant="destructive" className="h-8">
                <Phone className="h-3 w-3 mr-1" />
                Call 988
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Session Status */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>AI Assistant Active</span>
        </div>
      </div>

      <Card className="h-[600px] flex flex-col bg-white shadow-lg">
        <CardHeader className="border-b border-border bg-gradient-to-r from-cyan-50 to-violet-50">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>AI Mental Health Assistant</span>
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>Safe, confidential, and supportive. For emergencies, call 988.</span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: "calc(600px - 200px)" }}>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className="space-y-1">
                    <div
                      className={`rounded-lg px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border p-4 bg-white">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-3 w-3" />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInputValue("I'm feeling really anxious about my upcoming exams and can't focus")}
          className="text-xs"
        >
          Exam Anxiety
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInputValue("I've been feeling lonely and disconnected from my friends lately")}
          className="text-xs"
        >
          Loneliness
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInputValue("I can't sleep well and it's affecting everything in my life")}
          className="text-xs"
        >
          Sleep Issues
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInputValue("I'm feeling overwhelmed and need help managing my stress")}
          className="text-xs"
        >
          Stress Help
        </Button>
      </div>
    </div>
  )
}
