import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bookingRoutes } from "@/data/trainsRoutes";
import { ArrowRight, MapPin } from "lucide-react";

export default function TrainsRoutes() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Train List
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All available trains on the Howrah – Bardhaman – Durgapur corridor
          </p>
        </div>

        <Tabs defaultValue="up" className="w-full">
          <TabsList className="grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="up">Up Direction</TabsTrigger>
            <TabsTrigger value="down">Down Direction</TabsTrigger>
          </TabsList>

          {bookingRoutes.map((route) => (
            <TabsContent key={route.id} value={route.id} className="mt-6">
              {/* Route header */}
              <div
                className="flex flex-wrap items-center gap-2 mb-6 px-4 py-3 rounded-xl text-white font-semibold text-sm"
                style={{ background: "#1a56db" }}
              >
                <MapPin className="h-4 w-4" />
                {route.stops.map((stop, i) => (
                  <span key={stop} className="flex items-center gap-2">
                    {stop}
                    {i < route.stops.length - 1 && (
                      <ArrowRight className="h-4 w-4 opacity-70" />
                    )}
                  </span>
                ))}
              </div>

              {/* Train cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {route.trains.map((train) => (
                  <Card
                    key={train.id}
                    className="overflow-hidden border-blue-100 hover:border-blue-300 transition-colors"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={train.image}
                        alt={train.name}
                        className="w-full h-36 object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          className="text-xs font-mono"
                          style={{
                            background: "#1a56db",
                            color: "white",
                            border: 0,
                          }}
                        >
                          {train.number}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor:
                              route.direction === "Up" ? "#16a34a" : "#f97316",
                            color:
                              route.direction === "Up" ? "#16a34a" : "#f97316",
                          }}
                        >
                          {route.direction === "Up" ? "↑ Up" : "↓ Down"}
                        </Badge>
                      </div>
                      <CardTitle className="text-base mt-1">
                        {train.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {train.route}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
