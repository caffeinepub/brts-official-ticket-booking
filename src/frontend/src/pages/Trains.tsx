import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trains } from "@/data/trains";
import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const typeColors: Record<string, string> = {
  Rajdhani: "#7c3aed",
  Shatabdi: "#0891b2",
  "Vande Bharat": "#059669",
  Duronto: "#dc2626",
  Superfast: "#d97706",
  Express: "#1a56db",
  Humsafar: "#db2777",
};

export default function Trains() {
  const [query, setQuery] = useState("");

  const filtered = trains.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.number.includes(query) ||
      t.from.toLowerCase().includes(query.toLowerCase()) ||
      t.to.toLowerCase().includes(query.toLowerCase()) ||
      t.type.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">All Trains</h1>
        <p className="text-muted-foreground">
          Browse available trains across India
        </p>
      </div>

      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name, number, station, or type…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-ocid="trains.search_input"
        />
      </div>

      {filtered.length === 0 && (
        <div
          className="py-20 text-center text-muted-foreground"
          data-ocid="trains.empty_state"
        >
          No trains found for &quot;{query}&quot;
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((train, i) => (
          <motion.div
            key={train.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card
              className="overflow-hidden hover:shadow-lg transition-shadow group"
              data-ocid={`trains.item.${i + 1}`}
            >
              <div className="relative overflow-hidden" style={{ height: 180 }}>
                <img
                  src={train.image}
                  alt={train.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/320x180?text=Train+Image";
                  }}
                />
                <Badge
                  className="absolute top-2 left-2 text-xs font-mono"
                  style={{ background: "#1a56db", color: "white", border: 0 }}
                >
                  {train.number}
                </Badge>
                <Badge
                  className="absolute top-2 right-2 text-xs"
                  style={{
                    background: typeColors[train.type] || "#374151",
                    color: "white",
                    border: 0,
                  }}
                >
                  {train.type}
                </Badge>
              </div>
              <CardContent className="pt-4 pb-4">
                <h3 className="font-bold text-base mb-2">{train.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5" />
                  {train.from} → {train.to}
                </div>
                <div className="flex items-center text-sm mb-4">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {train.duration}
                  </span>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="w-full text-white"
                  style={{ background: "#f97316" }}
                  data-ocid={`trains.book_button.${i + 1}`}
                >
                  <Link to="/book">Book Now</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
