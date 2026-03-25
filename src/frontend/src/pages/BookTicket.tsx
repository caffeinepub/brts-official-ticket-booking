import SeatLayout, {
  generateSeats,
  type TravelClass,
} from "@/components/SeatLayout";
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
import { useActor } from "@/hooks/useActor";
import {
  type Booking,
  type Passenger,
  generateBooking,
  saveBooking,
} from "@/utils/storage";
import {
  CheckCircle2,
  Clock,
  Info,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Train,
} from "lucide-react";
import { motion } from "motion/react";
import { Suspense, lazy, useMemo, useState } from "react";

const RouteMap = lazy(() => import("@/components/RouteMap"));

const travelClasses: TravelClass[] = [
  "Sleeper",
  "AC 3 Tier",
  "AC 2 Tier",
  "General",
];
const quotas = ["General", "Tatkal", "Ladies"];

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

let _passengerIdCounter = 0;
const emptyPassenger = (): Passenger & { _id: number } => ({
  name: "",
  age: "",
  gender: "",
  _id: ++_passengerIdCounter,
});

export default function BookTicket() {
  const { actor } = useActor();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [searched, setSearched] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<TrainType | null>(null);
  const [travelClass, setTravelClass] = useState<TravelClass | "">("");
  const [quota, setQuota] = useState("General");
  // Seat selection
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [seatStepDone, setSeatStepDone] = useState(false);
  // Multi-passenger
  const [passengers, setPassengers] = useState<
    Array<Passenger & { _id: number }>
  >([emptyPassenger()]);
  // Preview & confirmation
  const [previewBooking, setPreviewBooking] = useState<Booking | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  const isUpDirection =
    from === "Howrah" || (from === "Barddhaman" && to === "Durgapur");
  const isDownDirection =
    from === "Durgapur" || (from === "Barddhaman" && to === "Howrah");

  const matchingTrains = trains.filter((t) => {
    if (isUpDirection) return t.from === "Howrah";
    if (isDownDirection) return t.from === "Durgapur";
    return true;
  });

  const seats = useMemo(
    () =>
      selectedTrain && date && travelClass
        ? generateSeats(selectedTrain.id, date, travelClass as TravelClass)
        : [],
    [selectedTrain, date, travelClass],
  );

  const handleToggleSeat = (seatNumber: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((n) => n !== seatNumber)
        : [...prev, seatNumber],
    );
  };

  const handleSearch = () => {
    if (!from || !to || !date) return;
    setSearched(true);
    setSelectedTrain(null);
    setSelectedSeats([]);
    setSeatStepDone(false);
    setConfirmedBooking(null);
    setPreviewBooking(null);
  };

  const handleClassChange = (cls: TravelClass) => {
    setTravelClass(cls);
    setSelectedSeats([]);
  };

  const addPassenger = () => {
    setPassengers((prev) => [...prev, emptyPassenger()]);
  };

  const removePassenger = (idx: number) => {
    setPassengers((prev) => prev.filter((_, i) => i !== idx));
    setSelectedSeats((prev) => {
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  };

  const updatePassenger = (
    idx: number,
    field: keyof Passenger,
    value: string,
  ) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
    );
  };

  const allPassengersFilled = passengers.every(
    (p) => p.name.trim() && p.age.trim() && p.gender,
  );

  const handlePreview = () => {
    if (!selectedTrain || !travelClass || !allPassengersFilled) return;
    const booking = generateBooking(
      passengers,
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
      quota,
      selectedSeats,
    );
    setPreviewBooking(booking);
  };

  const handleConfirm = async () => {
    if (!previewBooking || !actor) return;
    setLoading(true);
    setSaveError("");
    try {
      await saveBooking(actor, previewBooking);
      setConfirmedBooking(previewBooking);
      setPreviewBooking(null);
    } catch (e) {
      console.error("Failed to save booking:", e);
      setSaveError("Failed to save your booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFrom("");
    setTo("");
    setDate("");
    setSearched(false);
    setSelectedTrain(null);
    setTravelClass("");
    setQuota("General");
    setSelectedSeats([]);
    setSeatStepDone(false);
    setPassengers([emptyPassenger()]);
    setPreviewBooking(null);
    setConfirmedBooking(null);
    setSaveError("");
  };

  const showSeatStep = !!selectedTrain && !!date && !confirmedBooking;
  const showPassengerForm =
    showSeatStep && seatStepDone && !previewBooking && !confirmedBooking;
  const showPreview = !!previewBooking && !confirmedBooking;

  const getBerthLabel = (seatNum: number) => {
    const s = seats.find((seat) => seat.number === seatNum);
    return s ? `Seat ${seatNum} – ${s.berth}` : `Seat ${seatNum}`;
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
                    onClick={() => {
                      setSelectedTrain(train);
                      setSelectedSeats([]);
                      setSeatStepDone(false);
                      setPreviewBooking(null);
                    }}
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

      {/* Step 3: Class Selection + Seat Selection */}
      {showSeatStep && !seatStepDone && (
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
                Select Seats
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Class Selection — always shown first */}
              <div className="mb-5">
                <Label className="mb-1.5 block">Travel Class</Label>
                <Select
                  value={travelClass}
                  onValueChange={(v) => handleClassChange(v as TravelClass)}
                >
                  <SelectTrigger
                    data-ocid="book.class_select"
                    className="max-w-xs"
                  >
                    <SelectValue placeholder="Select travel class" />
                  </SelectTrigger>
                  <SelectContent>
                    {travelClasses.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* General Class — no seat layout */}
              {travelClass === "General" && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-start gap-3 mb-4">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-800 text-sm">
                      General Class — No Seat Selection
                    </p>
                    <p className="text-blue-700 text-sm mt-1">
                      Seat will be auto-assigned at time of boarding. No advance
                      seat reservation required.
                    </p>
                  </div>
                </div>
              )}

              {/* Seat layout for non-General classes */}
              {travelClass && travelClass !== "General" && (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select seats for your passengers — one seat per passenger.
                    You can also skip and seats will be auto-assigned.
                  </p>
                  <SeatLayout
                    seats={seats}
                    selectedSeats={selectedSeats}
                    onToggleSeat={handleToggleSeat}
                    travelClass={travelClass}
                  />
                </>
              )}

              {/* Continue button — shown only after class is selected */}
              {travelClass && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {selectedSeats.length > 0 && travelClass !== "General" && (
                    <span className="text-sm font-medium text-blue-700">
                      Selected: Seat{selectedSeats.length > 1 ? "s" : ""}{" "}
                      {selectedSeats.sort((a, b) => a - b).join(", ")}
                    </span>
                  )}
                  <Button
                    onClick={() => setSeatStepDone(true)}
                    style={{ background: "#1a56db" }}
                    className="text-white"
                    data-ocid="book.primary_button"
                  >
                    {travelClass === "General"
                      ? "Continue"
                      : selectedSeats.length > 0
                        ? `Continue with ${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""}`
                        : "Continue"}
                  </Button>
                  {travelClass !== "General" && selectedSeats.length === 0 && (
                    <button
                      type="button"
                      className="text-sm text-muted-foreground underline"
                      onClick={() => setSeatStepDone(true)}
                    >
                      Skip seat selection
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 4: Passenger Details */}
      {showPassengerForm && (
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
                  4
                </span>
                Passenger Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4">
                {passengers.map((p, idx) => (
                  <div
                    key={p._id}
                    className="border border-border rounded-xl p-4 relative"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#1a56db" }}
                      >
                        Passenger {idx + 1}
                        {travelClass !== "General" &&
                        selectedSeats[idx] !== undefined
                          ? ` — ${getBerthLabel(selectedSeats[idx])}`
                          : travelClass === "General"
                            ? " — General Class (Auto-assigned)"
                            : " — Seat auto-assigned"}
                      </p>
                      {passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePassenger(idx)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove passenger"
                          data-ocid={`book.delete_button.${idx + 1}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <Label className="mb-1.5 block text-xs">
                          Full Name
                        </Label>
                        <Input
                          placeholder="Passenger name"
                          value={p.name}
                          onChange={(e) =>
                            updatePassenger(idx, "name", e.target.value)
                          }
                          data-ocid="book.name_input"
                        />
                      </div>
                      <div>
                        <Label className="mb-1.5 block text-xs">Age</Label>
                        <Input
                          type="number"
                          placeholder="Age"
                          min={1}
                          max={120}
                          value={p.age}
                          onChange={(e) =>
                            updatePassenger(idx, "age", e.target.value)
                          }
                          data-ocid="book.age_input"
                        />
                      </div>
                      <div>
                        <Label className="mb-1.5 block text-xs">Gender</Label>
                        <Select
                          value={p.gender}
                          onValueChange={(v) =>
                            updatePassenger(idx, "gender", v)
                          }
                        >
                          <SelectTrigger data-ocid="book.gender_select">
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPassenger}
                className="mb-5 flex items-center gap-1"
                data-ocid="book.secondary_button"
              >
                <Plus className="h-4 w-4" /> Add Passenger
              </Button>

              {/* Quota selection only (class already chosen in Step 3) */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="mb-1.5 block">Quota</Label>
                  <Select value={quota} onValueChange={setQuota}>
                    <SelectTrigger data-ocid="book.quota_select">
                      <SelectValue placeholder="Select quota" />
                    </SelectTrigger>
                    <SelectContent>
                      {quotas.map((q) => (
                        <SelectItem key={q} value={q}>
                          {q}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end pb-1">
                  <p className="text-xs text-muted-foreground">
                    Class:{" "}
                    <span className="font-semibold text-foreground">
                      {travelClass}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 flex items-center gap-3">
                <Train
                  className="h-5 w-5 shrink-0"
                  style={{ color: "#1a56db" }}
                />
                <div className="text-sm">
                  <span className="font-semibold">{selectedTrain?.name}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {from} → {to} · {date}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  type="button"
                  className="text-sm text-muted-foreground underline"
                  onClick={() => setSeatStepDone(false)}
                >
                  ← Change Seat
                </button>
                <Button
                  onClick={handlePreview}
                  disabled={!allPassengersFilled || !travelClass}
                  style={{ background: "#f97316" }}
                  className="text-white"
                  data-ocid="book.submit_button"
                >
                  Preview Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 5: Ticket Preview */}
      {showPreview && previewBooking && (
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
                  5
                </span>
                Booking Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    PNR
                  </p>
                  <p
                    className="font-mono font-bold text-lg"
                    style={{ color: "#1a56db" }}
                  >
                    {previewBooking.pnr}
                  </p>
                </div>
                <Badge
                  className={
                    previewBooking.status === "CONFIRMED"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-orange-100 text-orange-800 border-orange-200"
                  }
                >
                  {previewBooking.status}
                </Badge>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Train</p>
                  <p className="font-medium">
                    {previewBooking.train.name} ({previewBooking.train.number})
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Route</p>
                  <p className="font-medium">
                    {previewBooking.train.from} → {previewBooking.train.to}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Travel Date</p>
                  <p className="font-medium">{previewBooking.travelDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Class</p>
                  <p className="font-medium">{previewBooking.travelClass}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quota</p>
                  <p className="font-medium">{previewBooking.quota}</p>
                </div>
              </div>

              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                        #
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                        Name
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                        Age
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                        Gender
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                        Coach
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                        Seat
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewBooking.passengers.map((p, i) => (
                      <tr key={p.seat} className="border-t border-border">
                        <td className="px-3 py-2 text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="px-3 py-2 font-medium">{p.name}</td>
                        <td className="px-3 py-2">{p.age}</td>
                        <td className="px-3 py-2">{p.gender}</td>
                        <td className="px-3 py-2">{p.coach}</td>
                        <td className="px-3 py-2 font-mono">{p.seat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {saveError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {saveError}
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => setPreviewBooking(null)}
                  data-ocid="book.cancel_button"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={loading || !actor}
                  style={{ background: "#f97316" }}
                  className="text-white"
                  data-ocid="book.confirm_button"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 6: Confirmation */}
      {confirmedBooking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-2 mb-4 text-green-700">
            <CheckCircle2 className="h-6 w-6" />
            <h2 className="text-xl font-bold">Booking Confirmed!</h2>
          </div>
          <TicketCard booking={confirmedBooking} index={0} />
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
