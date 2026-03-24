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

const STORAGE_KEY = "brts_tickets";

export function getTickets(): Ticket[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function saveTicket(ticket: Ticket): void {
  const tickets = getTickets();
  tickets.push(ticket);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

export function deleteTicket(pnr: string): void {
  const tickets = getTickets().filter((t) => t.pnr !== pnr);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

export function generateTicket(
  passenger: Passenger,
  train: TicketTrain,
  travelDate: string,
  travelClass: string,
): Ticket {
  const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
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
