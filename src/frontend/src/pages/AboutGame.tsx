import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lightbulb, Target, Zap } from "lucide-react";

export default function AboutGame() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            About the Game
          </h1>
          <p className="text-lg text-muted-foreground">
            Bhartiya Railway Train Simulator brings the authentic Indian
            Railways experience to life
          </p>
        </div>

        <Separator />

        {/* Realism Section */}
        <Card className="border-railway-blue/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-railway-blue" />
              <CardTitle className="text-2xl">Unmatched Realism</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              BRTS is built from the ground up to deliver the most authentic
              Indian railway simulation experience. Every aspect of the game is
              meticulously crafted to mirror real-world operations.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Accurate train physics and handling characteristics</li>
              <li>Real Indian railway signaling systems and protocols</li>
              <li>Authentic station layouts and infrastructure</li>
              <li>Dynamic weather and time-of-day systems</li>
              <li>Realistic passenger and freight operations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="border-railway-blue/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-railway-blue" />
              <CardTitle className="text-2xl">Core Features</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Diverse Train Fleet</h3>
                <p className="text-sm text-muted-foreground">
                  Drive a variety of trains from modern Vande Bharat Express to
                  classic passenger and freight locomotives
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Extensive Route Network</h3>
                <p className="text-sm text-muted-foreground">
                  Explore meticulously recreated routes connecting major Indian
                  cities and regions
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Career Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Progress from a trainee driver to a senior loco pilot through
                  challenging missions
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Free Roam</h3>
                <p className="text-sm text-muted-foreground">
                  Explore the railway network at your own pace without time
                  constraints
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Multiplayer Support</h3>
                <p className="text-sm text-muted-foreground">
                  Coordinate with other players in realistic railway operations
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Regular Updates</h3>
                <p className="text-sm text-muted-foreground">
                  New trains, routes, and features added based on community
                  feedback
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vision Section */}
        <Card className="border-railway-blue/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-railway-blue" />
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              At BRTS (Bhartiya Railway Studio), our mission is to create the
              definitive Indian railway simulation that educates, entertains,
              and celebrates the rich heritage of Indian Railways.
            </p>
            <p className="text-muted-foreground">
              We believe in building a game that not only provides entertainment
              but also serves as a learning tool for railway enthusiasts,
              aspiring loco pilots, and anyone fascinated by the complexity and
              beauty of India's railway network.
            </p>
            <p className="text-muted-foreground">
              Through continuous development and community engagement, we aim to
              expand BRTS into a comprehensive platform that covers all aspects
              of Indian railway operations, from suburban services to
              long-distance express trains, freight operations, and
              infrastructure management.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
