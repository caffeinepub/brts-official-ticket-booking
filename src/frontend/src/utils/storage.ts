import type {
  Booking as BackendBooking,
  Passenger as BackendPassenger,
  BookingStatus,
  TrainDetails,
  backendInterface,
} from "@/backend";
import { Principal } from "@icp-sdk/core/principal";

export interface Passenger {
  name: string;
  age: string;
  gender: string;
}

export interface PassengerWithSeat extends Passenger {
  seat: number;
  coach: string;
}

export interface TicketTrain {
  id: string;
  number: string;
  name: string;
  from: string;
  to: string;
  fare: number;
  type: string;
  duration: string;
}

export interface Booking {
  pnr: string;
  passengers: PassengerWithSeat[];
  train: TicketTrain;
  travelDate: string;
  travelClass: string;
  quota: string;
  status: "CONFIRMED" | "WAITING LIST";
  bookedAt: string;
}

type Actor = backendInterface;

// ─── Mapping helpers ─────────────────────────────────────────────────────────

function statusToString(s: BookingStatus): "CONFIRMED" | "WAITING LIST" {
  return s.__kind__ === "confirmed" ? "CONFIRMED" : "WAITING LIST";
}

function statusFromString(s: string): BookingStatus {
  if (s === "CONFIRMED") return { __kind__: "confirmed", confirmed: null };
  return { __kind__: "waiting", waiting: 0n };
}

function mapBackendBooking(b: BackendBooking): Booking {
  return {
    pnr: b.pnr,
    passengers: b.passengers.map((p) => ({
      name: p.name,
      age: String(Number(p.age)),
      gender: p.gender,
      coach: p.coach ?? "GN",
      seat: p.seat ? Number(p.seat) : 0,
    })),
    train: {
      id: b.trainDetails.trainNumber,
      number: b.trainDetails.trainNumber,
      name: b.trainDetails.trainName,
      from: b.trainDetails.journeyFrom,
      to: b.trainDetails.journeyTo,
      fare: 0,
      type: b.trainDetails.trainType,
      duration: "",
    },
    travelDate: b.travelDate,
    travelClass: b.bookingClass,
    quota: b.quota,
    status: statusToString(b.status),
    bookedAt: b.trainDetails.bookingTime,
  };
}

function mapBookingToBackend(booking: Booking): BackendBooking {
  const passengers: BackendPassenger[] = booking.passengers.map((p) => ({
    name: p.name,
    age: BigInt(Number.parseInt(p.age) || 0),
    gender: p.gender,
    coach: p.coach,
    seat: String(p.seat),
  }));

  const trainDetails: TrainDetails = {
    trainNumber: booking.train.number,
    trainName: booking.train.name,
    journeyFrom: booking.train.from,
    journeyTo: booking.train.to,
    trainType: booking.train.type,
    travelClass: booking.travelClass,
    quota: booking.quota,
    journeyDate: booking.travelDate,
    bookingTime: booking.bookedAt,
  };

  return {
    pnr: booking.pnr,
    status: statusFromString(booking.status),
    passengersCount: BigInt(booking.passengers.length),
    owner: Principal.anonymous(),
    quota: booking.quota,
    passengers,
    trainDetails,
    travelDate: booking.travelDate,
    bookingClass: booking.travelClass,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getTickets(actor: Actor): Promise<Booking[]> {
  const backendBookings = await actor.getAllBookings();
  return backendBookings.map(mapBackendBooking);
}

export async function saveBooking(
  actor: Actor,
  booking: Booking,
): Promise<void> {
  await actor.addBooking(mapBookingToBackend(booking));
}

export async function deleteBooking(actor: Actor, pnr: string): Promise<void> {
  await actor.cancelBooking(pnr);
}

export async function searchBookingByPnrAndName(
  actor: Actor,
  pnr: string,
  name: string,
): Promise<Booking | null> {
  const b = await actor.getBooking(pnr);
  if (!b) return null;
  const booking = mapBackendBooking(b);
  const queryName = name.trim().toLowerCase().replace(/\s+/g, " ");
  const hasMatch = booking.passengers.some(
    (p) => p.name.trim().toLowerCase().replace(/\s+/g, " ") === queryName,
  );
  if (!hasMatch) return null;
  return booking;
}

// ─── Booking generation ───────────────────────────────────────────────────────

const COACHES = ["A1", "A2", "B1", "B2", "B3", "C1", "C2", "S1", "S2", "S3"];

export function generateBooking(
  passengers: Passenger[],
  train: TicketTrain,
  travelDate: string,
  travelClass: string,
  quota: string,
  selectedSeats: number[],
): Booking {
  const pnr = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
  const coach = COACHES[Math.floor(Math.random() * COACHES.length)];
  const isGeneral = travelClass === "General";
  const assignedSeats = new Set<number>(selectedSeats);

  const passengersWithSeats: PassengerWithSeat[] = passengers.map((p, i) => {
    if (isGeneral) {
      return { ...p, seat: 0, coach: "GN" };
    }
    let seat = selectedSeats[i];
    if (seat === undefined) {
      do {
        seat = Math.floor(1 + Math.random() * 72);
      } while (assignedSeats.has(seat));
      assignedSeats.add(seat);
    }
    return { ...p, seat, coach };
  });

  const status =
    selectedSeats.length > 0
      ? "CONFIRMED"
      : Math.random() > 0.2
        ? "CONFIRMED"
        : "WAITING LIST";

  return {
    pnr,
    passengers: passengersWithSeats,
    train,
    travelDate,
    travelClass,
    quota,
    status,
    bookedAt: new Date().toISOString(),
  };
}

// Legacy - keep for compatibility
export function groupTicketsIntoBookings(bookings: Booking[]): Booking[] {
  return bookings;
}
