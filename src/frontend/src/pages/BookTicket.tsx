import TicketCard from "@/components/TicketCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Train as TrainType,
  stationImages,
  stations,
  trains,
} from "@/data/trains";
import { type Ticket, generateTicket, saveTicket } from "@/utils/storage";
import { CheckCircle2, Clock, Loader2, MapPin, Train } from "lucide-react";
import { motion } from "motion/react";
import { Suspense, lazy, useState } from "react";

const RouteMap = lazy(() => import("@/components/RouteMap"));

const classes = ["Sleeper", "AC3", "AC2", "AC1"];

// Small station preview card shown below a dropdown when a station is selected
function StationPreview({ station }: { station: string }) {
  const img = stationImages[station];
  if (!img) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 rounded-lg overflow-hidden border border-border shadow-sm"
    >
      <img
        src={img}
        alt={`${station} railway station`}
        className="w-full h-28 object-cover"
      />
      <div
        className="px-3 py-1.5 text-xs font-semibold text-white flex items-center gap-1"
        style={{ background: "#1a56db" }}
      >
        <MapPin className="h-3 w-3" />
        {station}
      </div>
    </motion.div>
  );
}

export default function BookTicket() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [searched, setSearched] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<TrainType | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [travelClass, setTravelClass] = useState("");
  const [confirmedTicket, setConfirmedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter trains based on direction:
  // Up = from Howrah side, Down = from Durgapur side
  const isUpDirection =
    from === "Howrah" || (from === "Barddhaman" && to === "Durgapur");
  const isDownDirection =
    from === "Durgapur" || (from === "Barddhaman" && to === "Howrah");

  const matchingTrains = trains.filter((t) => {
    if (isUpDirection) return t.from === "Howrah"; // up direction trains
    if (isDownDirection) return t.from === "Durgapur"; // down direction trains
    return true;
  });

  const handleSearch = () => {
    if (!from || !to || !date) return;
    setSearched(true);
    setSelectedTrain(null);
    setConfirmedTicket(null);
  };

  const handleBook = () => {
    if (!selectedTrain || !name || !age || !gender || !travelClass) return;
    setLoading(true);
    setTimeout(() => {
      const ticket = generateTicket(
        { name, age, gender },
        {
          id: selectedTrain.id,
          number: selectedTrain.number,
          name: selectedTrain.name,
          from,
          to,
          fare: selectedTrain.fare,
          type: selectedTrain.type,
          duration: selectedTrain.duration,
        },
        date,
        travelClass,
      );
      saveTicket(ticket);
      setConfirmedTicket(ticket);
      setLoading(false);
    }, 800);
  };

  const reset = () => {
    setFrom("");
    setTo("");
    setDate("");
    setSearched(false);
    setSelectedTrain(null);
    setName("");
    setAge("");
    setGender("");
    setTravelClass("");
    setConfirmedTicket(null);
  };

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-1">Book Ticket</h1>
      <p className="text-muted-foreground mb-8">
        Search trains and book your seat instantly
      </p>

      {/* Step 1: Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span
              className="w-7 h-7 rounded-full text-white text-sm flex items-center justify-center"
              style={{ background: "#1a56db" }}
            >
              1
            </span>
            Search Trains
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {/* From Station */}
            <div>
              <Label className="mb-1.5 block">From Station</Label>
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger data-ocid="book.from_select">
                  <SelectValue placeholder="Select origin" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {from && <StationPreview station={from} />}
            </div>

            {/* To Station */}
            <div>
              <Label className="mb-1.5 block">To Station</Label>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger data-ocid="book.to_select">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {to && <StationPreview station={to} />}
            </div>

            {/* Date */}
            <div>
              <Label className="mb-1.5 block">Travel Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                data-ocid="book.date_input"
              />
            </div>
          </div>
          <Button
            onClick={handleSearch}
            disabled={!from || !to || !date}
            style={{ background: "#1a56db" }}
            className="text-white"
            data-ocid="book.search_button"
          >
            Search Trains
          </Button>

          {/* Map */}
          {from && to && from !== to && (
            <div className="mt-5">
              <p className="text-sm font-medium mb-2 flex items-center gap-1">
                <MapPin className="h-4 w-4" style={{ color: "#1a56db" }} />
                Route: {from} → {to}
              </p>
              <Suspense
                fallback={
                  <div className="h-[300px] bg-muted rounded-xl flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                }
              >
                <RouteMap from={from} to={to} />
              </Suspense>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Train results */}
      {searched && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span
                  className="w-7 h-7 rounded-full text-white text-sm flex items-center justify-center"
                  style={{ background: "#1a56db" }}
                >
                  2
                </span>
                Select a Train
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {matchingTrains.map((train, i) => (
                  <button
                    key={train.id}
                    type="button"
                    className={`w-full text-left border rounded-xl p-4 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center gap-4 ${
                      selectedTrain?.id === train.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-border hover:border-blue-300"
                    }`}
                    onClick={() => setSelectedTrain(train)}
                    data-ocid={`book.train.item.${i + 1}`}
                  >
                    <img
                      src={train.image}
                      alt={train.name}
                      className="w-full sm:w-28 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
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
                        <Badge variant="outline" className="text-xs">
                          {train.type}
                        </Badge>
                      </div>
                      <p className="font-bold">{train.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {from} → {to}
                      </p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {train.duration}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Passenger form */}
      {selectedTrain && !confirmedTicket && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span
                  className="w-7 h-7 rounded-full text-white text-sm flex items-center justify-center"
                  style={{ background: "#1a56db" }}
                >
                  3
                </span>
                Passenger Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="mb-1.5 block">Full Name</Label>
                  <Input
                    placeholder="Enter passenger name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-ocid="book.name_input"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Age</Label>
                  <Input
                    type="number"
                    placeholder="Age"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    data-ocid="book.age_input"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger data-ocid="book.gender_select">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block">Travel Class</Label>
                  <Select value={travelClass} onValueChange={setTravelClass}>
                    <SelectTrigger data-ocid="book.class_select">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 flex items-center gap-3">
                <Train
                  className="h-5 w-5 shrink-0"
                  style={{ color: "#1a56db" }}
                />
                <div className="text-sm">
                  <span className="font-semibold">{selectedTrain.name}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {from} → {to} · {date}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleBook}
                disabled={!name || !age || !gender || !travelClass || loading}
                style={{ background: "#f97316" }}
                className="text-white w-full sm:w-auto"
                data-ocid="book.submit_button"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                    Processing…
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 4: Confirmation */}
      {confirmedTicket && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-2 mb-4 text-green-700">
            <CheckCircle2 className="h-6 w-6" />
            <h2 className="text-xl font-bold">Booking Confirmed!</h2>
          </div>
          <TicketCard ticket={confirmedTicket} index={0} />
          <Button
            variant="outline"
            className="mt-4"
            onClick={reset}
            data-ocid="book.secondary_button"
          >
            Book Another Ticket
          </Button>
        </motion.div>
      )}
    </div>
  );
}
