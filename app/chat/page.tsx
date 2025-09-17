import { ChatInterface } from "@/components/chat-interface"
import { Header } from "@/components/header"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">AI Mental Health Support</h1>
            <p className="text-lg text-muted-foreground">
              Chat with our AI assistant for immediate support, coping strategies, and mental health guidance.
            </p>
          </div>
          <ChatInterface />
        </div>
      </main>
    </div>
  )
}
