import { ChatInterface } from "@/components/chat-interface"

export default function AISupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-violet-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Mental Health Support</h1>
            <p className="text-lg text-gray-600">
              Chat with our AI assistant for immediate support, coping strategies, and mental health guidance.
            </p>
          </div>
          <ChatInterface />
        </div>
      </main>
    </div>
  )
}
