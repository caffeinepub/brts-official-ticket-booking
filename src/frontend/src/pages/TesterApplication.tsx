import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/siteConfig";
import {
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Users,
  Zap,
} from "lucide-react";

export default function TesterApplication() {
  const testerFormUrl = siteConfig.links.testerForm;
  const isFormConfigured =
    testerFormUrl && !testerFormUrl.includes("forms.google.com/brts-tester");

  const handleApply = () => {
    if (isFormConfigured) {
      window.open(testerFormUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="container py-12 md:py-16">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Tester Program
          </h1>
          <p className="text-lg text-muted-foreground">
            Join our community of testers and help shape the future of BRTS
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-railway-blue/20">
            <CardHeader>
              <Zap className="h-8 w-8 text-railway-blue mb-2" />
              <CardTitle>Early Access</CardTitle>
              <CardDescription>
                Be the first to experience new features, trains, and routes
                before public release
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-railway-blue/20">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-railway-blue mb-2" />
              <CardTitle>Direct Feedback</CardTitle>
              <CardDescription>
                Your input directly influences development priorities and game
                improvements
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-railway-blue/20">
            <CardHeader>
              <Users className="h-8 w-8 text-railway-blue mb-2" />
              <CardTitle>Exclusive Community</CardTitle>
              <CardDescription>
                Join a dedicated group of railway enthusiasts and simulation
                fans
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Application Card */}
        <Card className="border-railway-blue/20">
          <CardHeader>
            <CardTitle className="text-2xl">What We're Looking For</CardTitle>
            <CardDescription>
              We welcome testers of all experience levels who are passionate
              about railways and simulation games
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-railway-blue mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Railway Enthusiasts</h3>
                  <p className="text-sm text-muted-foreground">
                    Knowledge of Indian Railways operations, trains, and routes
                    is valuable but not required
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-railway-blue mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Simulation Fans</h3>
                  <p className="text-sm text-muted-foreground">
                    Experience with train simulators or other simulation games
                    helps provide valuable feedback
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-railway-blue mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Active Communicators</h3>
                  <p className="text-sm text-muted-foreground">
                    Ability to provide detailed bug reports and constructive
                    feedback through Discord
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-railway-blue mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Regular Players</h3>
                  <p className="text-sm text-muted-foreground">
                    Commitment to testing new builds and participating in
                    community discussions
                  </p>
                </div>
              </div>
            </div>

            {!isFormConfigured && (
              <Alert>
                <AlertDescription>
                  The tester application form is currently being set up. Please
                  check back soon or join our Discord for updates.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-railway-blue hover:bg-railway-blue/90"
                onClick={handleApply}
                disabled={!isFormConfigured}
              >
                {isFormConfigured ? (
                  <>
                    Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Application Coming Soon"
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  window.open(
                    siteConfig.links.discord,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                Join Discord First
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Requirements Card */}
        <Card className="border-railway-blue/20">
          <CardHeader>
            <CardTitle>Testing Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Platform</h3>
              <p className="text-sm text-muted-foreground">
                Roblox account required. Game is accessible on PC, Mac, and
                mobile devices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Communication</h3>
              <p className="text-sm text-muted-foreground">
                Discord account required for tester community access and
                feedback submission.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Time Commitment</h3>
              <p className="text-sm text-muted-foreground">
                Flexible - test at your own pace. We appreciate any time you can
                dedicate to testing and feedback.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
