import StatusBadge from "@/components/common/StatusBadge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updates } from "@/data/updates";
import { Calendar } from "lucide-react";

export default function DevelopmentUpdates() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Development Updates
          </h1>
          <p className="text-lg text-muted-foreground">
            Stay informed about the latest features, improvements, and patch
            notes
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {updates.map((update) => (
            <Card key={update.id} className="border-railway-blue/20">
              <CardHeader>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={update.date}>
                        {new Date(update.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    {update.status && <StatusBadge status={update.status} />}
                  </div>
                  <CardTitle className="text-2xl">{update.title}</CardTitle>
                  <CardDescription className="text-base">
                    {update.summary}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="details" className="border-none">
                    <AccordionTrigger className="text-sm font-medium hover:text-railway-blue">
                      View Full Patch Notes
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none pt-4">
                        <div className="whitespace-pre-line text-muted-foreground">
                          {update.content}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
