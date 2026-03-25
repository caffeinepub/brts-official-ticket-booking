import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
  __kind__: "Some";
  value: T;
}
export interface None {
  __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}
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
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
}
export enum UserRole {
  admin = "admin",
  user = "user",
  guest = "guest",
}
export interface backendInterface {
  assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
  deleteTicket(pnr: string): Promise<void>;
  getAllTickets(): Promise<Array<Ticket>>;
  getCallerUserProfile(): Promise<UserProfile | null>;
  getCallerUserRole(): Promise<UserRole>;
  getTicketByPnr(pnr: string): Promise<Ticket | null>;
  getUserProfile(user: Principal): Promise<UserProfile | null>;
  isCallerAdmin(): Promise<boolean>;
  listMessages(): Promise<Array<ContactMessage>>;
  saveCallerUserProfile(profile: UserProfile): Promise<void>;
  saveTicket(ticket: Ticket): Promise<void>;
  submitMessage(message: ContactMessage): Promise<void>;
}
