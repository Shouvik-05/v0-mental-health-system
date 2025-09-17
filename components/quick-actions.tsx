import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, MessageSquare, Calendar, Users } from "lucide-react"

export function QuickActions() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Need Help Right Now?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick access to immediate support when you need it most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="font-semibold mb-2">Crisis Hotline</h3>
              <p className="text-sm text-muted-foreground mb-4">24/7 emergency support</p>
              <Button variant="destructive" size="sm" className="w-full">
                Call Now
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">Instant AI support</p>
              <Button size="sm" className="w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Quick Booking</h3>
              <p className="text-sm text-muted-foreground mb-4">Same-day appointments</p>
              <Button variant="secondary" size="sm" className="w-full">
                Book Today
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Peer Support</h3>
              <p className="text-sm text-muted-foreground mb-4">Connect with others</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Join Group
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
