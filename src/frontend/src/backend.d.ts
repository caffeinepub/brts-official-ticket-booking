export interface Ticket {
    pnr: string;
    status: string;
    passengerGender: string;
    trainNumber: string;
    trainDuration: string;
    bookedAt: string;
    coach: string;
    seat: bigint;
    trainFrom: string;
    trainName: string;
    trainType: string;
    passengerName: string;
    trainTo: string;
    travelDate: string;
    travelClass: string;
    passengerAge: string;
}
export interface backendInterface {
    deleteTicket(pnr: string): Promise<void>;
    getAllTickets(): Promise<Array<Ticket>>;
    getTicketByPnr(pnr: string): Promise<Ticket | null>;
    saveTicket(ticket: Ticket): Promise<void>;
}
