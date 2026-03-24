import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/siteConfig";
import { Gamepad2 } from "lucide-react";
import { SiDiscord, SiYoutube } from "react-icons/si";

export default function Community() {
  const handleExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container py-12 md:py-16">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Join Our Community
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with fellow railway enthusiasts and stay updated on the
            latest developments
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          {/* Discord */}
          <Card className="border-railway-blue/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#5865F2]/10 to-[#5865F2]/5 p-8">
              <CardHeader className="p-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-full bg-[#5865F2] p-3">
                    <SiDiscord className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Discord Server</CardTitle>
                    <CardDescription className="text-base">
                      Join our active community
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <p className="text-muted-foreground">
                  Our Discord server is the heart of the BRTS community. Connect
                  with developers, share your experiences, get help, participate
                  in events, and be the first to know about updates and testing
                  opportunities.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Direct communication with the development team</li>
                  <li>Exclusive sneak peeks and behind-the-scenes content</li>
                  <li>Community events and competitions</li>
                  <li>Technical support and troubleshooting</li>
                  <li>Share screenshots, videos, and experiences</li>
                </ul>
                <Button
                  size="lg"
                  className="bg-[#5865F2] hover:bg-[#5865F2]/90"
                  onClick={() => handleExternalLink(siteConfig.links.discord)}
                >
                  Join Discord Server
                </Button>
              </CardContent>
            </div>
          </Card>

          {/* YouTube */}
          <Card className="border-railway-blue/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF0000]/10 to-[#FF0000]/5 p-8">
              <CardHeader className="p-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-full bg-[#FF0000] p-3">
                    <SiYoutube className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">YouTube Channel</CardTitle>
                    <CardDescription className="text-base">
                      Watch gameplay and tutorials
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <p className="text-muted-foreground">
                  Subscribe to our YouTube channel for gameplay videos,
                  development updates, tutorials, and feature showcases. Learn
                  how to master train operations and explore the game's
                  features.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Gameplay walkthroughs and tutorials</li>
                  <li>Development progress videos</li>
                  <li>Feature demonstrations and guides</li>
                  <li>Community highlights and showcases</li>
                  <li>Update announcements and patch notes</li>
                </ul>
                <Button
                  size="lg"
                  className="bg-[#FF0000] hover:bg-[#FF0000]/90"
                  onClick={() => handleExternalLink(siteConfig.links.youtube)}
                >
                  Subscribe on YouTube
                </Button>
              </CardContent>
            </div>
          </Card>

          {/* Roblox */}
          <Card className="border-railway-blue/20 overflow-hidden">
            <div className="bg-gradient-to-r from-railway-blue/10 to-railway-blue/5 p-8">
              <CardHeader className="p-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-full bg-railway-blue p-3">
                    <Gamepad2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Roblox Game</CardTitle>
                    <CardDescription className="text-base">
                      Play now on Roblox
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <p className="text-muted-foreground">
                  Experience Bhartiya Railway Train Simulator on Roblox. Join
                  thousands of players in the most realistic Indian railway
                  simulation. Available on PC, Mac, mobile, and console.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Free to play on Roblox platform</li>
                  <li>Cross-platform multiplayer support</li>
                  <li>Regular updates and new content</li>
                  <li>Active player community</li>
                  <li>Accessible on multiple devices</li>
                </ul>
                <Button
                  size="lg"
                  className="bg-railway-blue hover:bg-railway-blue/90"
                  onClick={() => handleExternalLink(siteConfig.links.roblox)}
                >
                  Play on Roblox
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Community Guidelines */}
        <Card className="border-railway-blue/20">
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
            <CardDescription>
              Help us maintain a welcoming and respectful community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Be respectful and courteous to all community members</p>
            <p>• Keep discussions relevant to BRTS and railway simulation</p>
            <p>• Provide constructive feedback and suggestions</p>
            <p>• Help new players learn and enjoy the game</p>
            <p>• Report bugs and issues through proper channels</p>
            <p>• Follow platform-specific rules (Discord, YouTube, Roblox)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
