import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trains } from "@/data/trains";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Clock,
  FileDown,
  MapPin,
  Search,
  Shield,
  Ticket,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Ticket,
    title: "Instant Booking",
    desc: "Book your train ticket in under 60 seconds with our streamlined checkout.",
  },
  {
    icon: FileDown,
    title: "PDF Tickets",
    desc: "Download your ticket as a professional PDF — ready to print or show on mobile.",
  },
  {
    icon: Search,
    title: "PNR Check",
    desc: "Track your booking status and get full ticket details by PNR number.",
  },
  {
    icon: Shield,
    title: "Secure Admin",
    desc: "Password-protected admin panel to manage all bookings, delete or download tickets.",
  },
];

const popularTrains = trains.slice(0, 4);

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a56db 0%, #1e40af 60%, #1e3a8a 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)",
          }}
        />
        <div className="container relative py-20 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Official BRTS Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <img
                src="/assets/uploads/img_20260312_202124-019d1f50-677a-7697-ad9b-e89b3c8ecd4d-1.png"
                alt="BRTS Official Logo"
                style={{
                  height: 110,
                  width: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))",
                }}
              />
            </motion.div>

            <Badge className="mb-4 bg-orange-500 text-white border-0 text-xs px-3 py-1">
              🚂 BRTS Official Ticket Booking
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
              Experience Seamless
              <br />
              <span style={{ color: "#f97316" }}>Railway Booking</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl mx-auto">
              Book train tickets instantly, check your PNR, and download your
              ticket as PDF — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="text-white font-semibold"
                style={{ background: "#f97316" }}
                data-ocid="hero.primary_button"
              >
                <Link to="/book">
                  Book Now <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white bg-transparent hover:bg-white/10"
                data-ocid="hero.secondary_button"
              >
                <Link to="/trains">View Trains</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-2">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-center mb-10">
              A complete railway ticketing experience in your browser
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 pb-6">
                    <div
                      className="mx-auto mb-4 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: "#eff6ff" }}
                    >
                      <f.icon
                        className="h-6 w-6"
                        style={{ color: "#1a56db" }}
                      />
                    </div>
                    <h3 className="font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Trains */}
      <section className="py-16" style={{ background: "#f8fafc" }}>
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Popular Trains</h2>
              <p className="text-muted-foreground mt-1">
                Top routes across India
              </p>
            </div>
            <Button asChild variant="outline" data-ocid="home.link">
              <Link to="/trains">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularTrains.map((train, i) => (
              <motion.div
                key={train.id}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div
                    className="relative overflow-hidden"
                    style={{ height: 140 }}
                  >
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
                      className="absolute top-2 left-2 text-xs"
                      style={{
                        background: "#1a56db",
                        color: "white",
                        border: 0,
                      }}
                    >
                      {train.number}
                    </Badge>
                  </div>
                  <CardContent className="pt-3 pb-4">
                    <p className="font-semibold text-sm mb-1 leading-tight">
                      {train.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      {train.from} → {train.to}
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {train.duration}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
