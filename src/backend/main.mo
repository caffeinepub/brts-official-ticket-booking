import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  public type Passenger = {
    name : Text;
    age : Nat;
    gender : Text;
    coach : ?Text;
    seat : ?Text;
  };

  public type TrainDetails = {
    trainName : Text;
    trainNumber : Text;
    journeyFrom : Text;
    journeyTo : Text;
    trainType : Text;
    journeyDate : Text;
    travelClass : Text;
    quota : Text;
    bookingTime : Text;
  };

  public type BookingStatus = {
    #confirmed;
    #waiting : Nat;
  };

  public type Booking = {
    pnr : Text;
    passengers : [Passenger];
    trainDetails : TrainDetails;
    travelDate : Text;
    bookingClass : Text;
    quota : Text;
    passengersCount : Nat;
    status : BookingStatus;
    owner : Principal;
  };

  // Retained for upgrade compatibility
  let userProfiles = Map.empty<Principal, UserProfile>();

  let bookings = Map.empty<Text, Booking>();

  // Add booking - no auth required, open to all callers
  public shared ({ caller }) func addBooking(booking : Booking) : async () {
    if (booking.passengersCount > 6) {
      Runtime.trap("Maximum 6 passengers allowed per booking");
    };
    let bookingWithOwner = {
      pnr = booking.pnr;
      passengers = booking.passengers;
      trainDetails = booking.trainDetails;
      travelDate = booking.travelDate;
      bookingClass = booking.bookingClass;
      quota = booking.quota;
      passengersCount = booking.passengersCount;
      status = booking.status;
      owner = caller;
    };
    bookings.add(booking.pnr, bookingWithOwner);
  };

  // Get booking by PNR
  public query func getBooking(pnr : Text) : async ?Booking {
    bookings.get(pnr);
  };

  // Get all bookings
  public query func getAllBookings() : async [Booking] {
    bookings.values().toArray();
  };

  // Cancel booking by PNR
  public shared func cancelBooking(pnr : Text) : async Bool {
    switch (bookings.get(pnr)) {
      case (?_) { bookings.remove(pnr); true; };
      case null { false };
    };
  };

  // Get bookings by passenger name
  public query func getBookingsByPassengerName(name : Text) : async [Booking] {
    let result = List.empty<Booking>();
    for (booking in bookings.values()) {
      let hasPassenger = booking.passengers.values().any(func(p) { p.name == name });
      if (hasPassenger) { result.add(booking); };
    };
    result.toArray();
  };

  // Get bookings by date
  public query func getBookingsByDate(date : Text) : async [Booking] {
    let result = List.empty<Booking>();
    for (booking in bookings.values()) {
      if (booking.travelDate == date) { result.add(booking); };
    };
    result.toArray();
  };

  // Get confirmed bookings
  public query func getConfirmedBookings() : async [Booking] {
    let result = List.empty<Booking>();
    for (booking in bookings.values()) {
      switch (booking.status) {
        case (#confirmed) { result.add(booking); };
        case (_) {};
      };
    };
    result.toArray();
  };

  // Get waiting bookings
  public query func getWaitingBookings() : async [Booking] {
    let result = List.empty<Booking>();
    for (booking in bookings.values()) {
      switch (booking.status) {
        case (#waiting(_)) { result.add(booking); };
        case (_) {};
      };
    };
    result.toArray();
  };

  // Get total count
  public query func getTotalBookingsCount() : async Nat {
    bookings.size();
  };
};
