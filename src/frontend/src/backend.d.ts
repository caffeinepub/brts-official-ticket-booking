import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Passenger {
    age: bigint;
    name: string;
    coach?: string;
    seat?: string;
    gender: string;
}
export type BookingStatus = {
    __kind__: "confirmed";
    confirmed: null;
} | {
    __kind__: "waiting";
    waiting: bigint;
};
export interface Booking {
    pnr: string;
    status: BookingStatus;
    passengersCount: bigint;
    owner: Principal;
    quota: string;
    passengers: Array<Passenger>;
    trainDetails: TrainDetails;
    travelDate: string;
    bookingClass: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface TrainDetails {
    trainNumber: string;
    journeyTo: string;
    trainName: string;
    trainType: string;
    quota: string;
    bookingTime: string;
    journeyDate: string;
    journeyFrom: string;
    travelClass: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBooking(booking: Booking): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelBooking(pnr: string): Promise<boolean>;
    getAllBookings(): Promise<Array<Booking>>;
    getBooking(pnr: string): Promise<Booking | null>;
    getBookingsByDate(date: string): Promise<Array<Booking>>;
    getBookingsByPassengerName(name: string): Promise<Array<Booking>>;
    getBookingsByTrainNumber(trainNumber: string): Promise<Array<Booking>>;
    getBookingsCountByClass(bookingClass: string): Promise<bigint>;
    getBookingsCountByQuota(quota: string): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConfirmedBookings(): Promise<Array<Booking>>;
    getTotalBookingsCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWaitingBookings(): Promise<Array<Booking>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
