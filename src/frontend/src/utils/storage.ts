import type { backendInterface } from "@/backend";

export interface Passenger {
  name: string;
  age: string;
  gender: string;
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
  bookedAt: string;
}

type Actor = backendInterface;
type BackendTicket = Awaited<ReturnType<Actor["getAllTickets"]>>[number];

function mapBackendToTicket(bt: BackendTicket): Ticket {
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
    travelClass: bt.travelClass,
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
    travelClass: ticket.travelClass,
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
    bookedAt: new Date().toISOString(),
  };
}
