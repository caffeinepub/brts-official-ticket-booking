import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";

module {
  type UserProfile = { name : Text; email : Text; phone : Text };

  type OldTicket = {
    pnr : Text;
    passengerName : Text;
    passengerAge : Text;
    passengerGender : Text;
    trainName : Text;
    trainNumber : Text;
    trainFrom : Text;
    trainTo : Text;
    trainType : Text;
    trainDuration : Text;
    travelDate : Text;
    travelClass : Text;
    coach : Text;
    seat : Nat;
    status : Text;
    bookedAt : Text;
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    messageCounter : Nat;
    messages : Map.Map<Nat, { name : Text; email : Text; message : Text }>;
    tickets : Map.Map<Nat, OldTicket>;
    ticketCounter : Nat;
  };

  type NewPassenger = {
    name : Text;
    age : Nat;
    gender : Text;
    coach : ?Text;
    seat : ?Text;
  };

  type NewTrainDetails = {
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

  type NewBookingStatus = {
    #confirmed;
    #waiting : Nat;
  };

  type NewBooking = {
    pnr : Text;
    passengers : [NewPassenger];
    trainDetails : NewTrainDetails;
    travelDate : Text;
    bookingClass : Text;
    quota : Text;
    passengersCount : Nat;
    status : NewBookingStatus;
    owner : Principal.Principal;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    bookings : Map.Map<Text, NewBooking>;
  };

  // Helper function to map OldPassenger to NewPassenger
  func oldPassengerToNew(passengerName : Text, passengerAge : Text, passengerGender : Text, coach : Text, seat : Nat) : NewPassenger {
    let age = switch (Nat.fromText(passengerAge)) {
      case (?a) { a };
      case (null) { 0 };
    };
    let seatText = seat.toText();

    {
      name = passengerName;
      age;
      gender = passengerGender;
      coach = ?coach;
      seat = ?seatText;
    };
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    let newBookings = Map.empty<Text, NewBooking>();

    for ((id, oldTicket) in old.tickets.entries()) {
      let newPassengers = List.singleton<NewPassenger>(
        oldPassengerToNew(oldTicket.passengerName, oldTicket.passengerAge, oldTicket.passengerGender, oldTicket.coach, oldTicket.seat)
      ).toArray();

      let newTrainDetails : NewTrainDetails = {
        trainName = oldTicket.trainName;
        trainNumber = oldTicket.trainNumber;
        journeyFrom = oldTicket.trainFrom;
        journeyTo = oldTicket.trainTo;
        trainType = oldTicket.trainType;
        journeyDate = oldTicket.trainDuration;
        travelClass = oldTicket.travelClass;
        quota = "GENERAL";
        bookingTime = oldTicket.bookedAt;
      };

      let newBooking : NewBooking = {
        pnr = oldTicket.pnr;
        passengers = newPassengers;
        trainDetails = newTrainDetails;
        travelDate = oldTicket.travelDate;
        bookingClass = oldTicket.travelClass;
        quota = "GENERAL";
        passengersCount = 1;
        status = #confirmed;
        owner = Principal.anonymous();
      };

      newBookings.add(oldTicket.pnr, newBooking);
    };

    {
      accessControlState = old.accessControlState;
      userProfiles = old.userProfiles;
      bookings = newBookings;
    };
  };
};
