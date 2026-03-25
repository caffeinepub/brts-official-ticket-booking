import type { backendInterface } from "@/backend";

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

export interface Ticket {
  pnr: string;
  coach: string;
  seat: number;
  status: "CONFIRMED" | "WAITING LIST";
  passenger: Passenger;
  train: TicketTrain;
  travelDate: string;
  travelClass: string;
  quota: string;
  bookedAt: string;
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
type BackendTicket = Awaited<ReturnType<Actor["getAllTickets"]>>[number];

function encodeClassQuota(travelClass: string, quota: string): string {
  return `${travelClass} | ${quota}`;
}

function decodeClassQuota(stored: string): {
  travelClass: string;
  quota: string;
} {
  const idx = stored.lastIndexOf(" | ");
  if (idx === -1) return { travelClass: stored, quota: "General" };
  return { travelClass: stored.slice(0, idx), quota: stored.slice(idx + 3) };
}

export function mapBackendToTicket(bt: BackendTicket): Ticket {
  const { travelClass, quota } = decodeClassQuota(bt.travelClass);
  return {
    pnr: bt.pnr,
    coach: bt.coach,
    seat: Number(bt.seat),
    status: (bt.status as "CONFIRMED" | "WAITING LIST") || "CONFIRMED",
    passenger: {
      name: bt.passengerName,
      age: bt.passengerAge,
      gender: bt.passengerGender,
    },
    train: {
      id: bt.trainNumber,
      number: bt.trainNumber,
      name: bt.trainName,
      from: bt.trainFrom,
      to: bt.trainTo,
      fare: 0,
      type: bt.trainType,
      duration: bt.trainDuration,
    },
    travelDate: bt.travelDate,
    travelClass,
    quota,
    bookedAt: bt.bookedAt,
  };
}

function mapTicketToBackend(ticket: Ticket): BackendTicket {
  return {
    pnr: ticket.pnr,
    coach: ticket.coach,
    seat: BigInt(ticket.seat),
    status: ticket.status,
    passengerName: ticket.passenger.name,
    passengerAge: ticket.passenger.age,
    passengerGender: ticket.passenger.gender,
    trainNumber: ticket.train.number,
    trainName: ticket.train.name,
    trainFrom: ticket.train.from,
    trainTo: ticket.train.to,
    trainType: ticket.train.type,
    trainDuration: ticket.train.duration,
    travelDate: ticket.travelDate,
    travelClass: encodeClassQuota(ticket.travelClass, ticket.quota),
    bookedAt: ticket.bookedAt,
  };
}

export async function getTickets(actor: Actor): Promise<Ticket[]> {
  const backendTickets = await actor.getAllTickets();
  return backendTickets.map(mapBackendToTicket);
}

export async function saveTicket(actor: Actor, ticket: Ticket): Promise<void> {
  await actor.saveTicket(mapTicketToBackend(ticket));
}

export async function deleteTicket(actor: Actor, pnr: string): Promise<void> {
  await actor.deleteTicket(pnr);
}

export async function searchTicketByPnrAndName(
  actor: Actor,
  pnr: string,
  name: string,
): Promise<Ticket | null> {
  const bt = await actor.getTicketByPnr(pnr);
  if (!bt) return null;
  const storedName = bt.passengerName.trim().toLowerCase().replace(/\s+/g, " ");
  const queryName = name.trim().toLowerCase().replace(/\s+/g, " ");
  if (storedName !== queryName) return null;
  return mapBackendToTicket(bt);
}

export function generateTicket(
  passenger: Passenger,
  train: TicketTrain,
  travelDate: string,
  travelClass: string,
): Ticket {
  const pnr = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
  const coaches = ["A1", "A2", "B1", "B2", "B3", "C1", "C2", "S1", "S2", "S3"];
  const coach = coaches[Math.floor(Math.random() * coaches.length)];
  const seat = Math.floor(1 + Math.random() * 72);
  const status = Math.random() > 0.2 ? "CONFIRMED" : "WAITING LIST";
  return {
    pnr,
    coach,
    seat,
    status: status as "CONFIRMED" | "WAITING LIST",
    passenger,
    train,
    travelDate,
    travelClass,
    quota: "General",
    bookedAt: new Date().toISOString(),
  };
}

// ─── Multi-passenger booking utilities ───────────────────────────────────────

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
      // GN class — no seat assignment
      return { ...p, seat: 0, coach: "GN" };
    }
    let seat = selectedSeats[i];
    if (seat === undefined) {
      // Auto-assign a seat not already picked
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

export async function saveBooking(
  actor: Actor,
  booking: Booking,
): Promise<void> {
  await Promise.all(
    booking.passengers.map((p) =>
      saveTicket(actor, {
        pnr: booking.pnr,
        coach: p.coach,
        seat: p.seat,
        status: booking.status,
        passenger: { name: p.name, age: p.age, gender: p.gender },
        train: booking.train,
        travelDate: booking.travelDate,
        travelClass: booking.travelClass,
        quota: booking.quota,
        bookedAt: booking.bookedAt,
      }),
    ),
  );
}

export function groupTicketsIntoBookings(tickets: Ticket[]): Booking[] {
  const map = new Map<string, Ticket[]>();
  for (const t of tickets) {
    const group = map.get(t.pnr) ?? [];
    group.push(t);
    map.set(t.pnr, group);
  }
  const bookings: Booking[] = [];
  for (const [pnr, group] of map) {
    const first = group[0];
    bookings.push({
      pnr,
      passengers: group.map((t) => ({
        name: t.passenger.name,
        age: t.passenger.age,
        gender: t.passenger.gender,
        seat: t.seat,
        coach: t.coach,
      })),
      train: first.train,
      travelDate: first.travelDate,
      travelClass: first.travelClass,
      quota: first.quota,
      status: first.status,
      bookedAt: first.bookedAt,
    });
  }
  return bookings;
}

export async function searchBookingByPnrAndName(
  actor: Actor,
  pnr: string,
  name: string,
): Promise<Booking | null> {
  const allTickets = await actor.getAllTickets();
  const matching = allTickets
    .filter((bt) => bt.pnr === pnr)
    .map(mapBackendToTicket);
  if (matching.length === 0) return null;
  const queryName = name.trim().toLowerCase().replace(/\s+/g, " ");
  const hasMatch = matching.some(
    (t) =>
      t.passenger.name.trim().toLowerCase().replace(/\s+/g, " ") === queryName,
  );
  if (!hasMatch) return null;
  const groups = groupTicketsIntoBookings(matching);
  return groups[0] ?? null;
}

export async function deleteBooking(actor: Actor, pnr: string): Promise<void> {
  const allTickets = await actor.getAllTickets();
  const count = allTickets.filter((bt) => bt.pnr === pnr).length;
  for (let i = 0; i < count; i++) {
    await actor.deleteTicket(pnr);
  }
}
