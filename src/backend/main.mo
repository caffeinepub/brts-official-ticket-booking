import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";


import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


actor {
  // Include prefabricated MixinAuthorization module to enable authentication and authorization.
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile for the booking system
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Booking types
  public type FunctionBooking = {
    trainNumber : Text;
    bookingDate : Text;
    bookingClass : Text;
    quotaType : Text;
    pnr : Text;
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

  let bookings = Map.empty<Text, Booking>();

  // Add booking - requires user permission
  public shared ({ caller }) func addBooking(booking : Booking) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create bookings");
    };
    if (booking.passengersCount > 6) {
      Runtime.trap("Maximum 6 passengers allowed per booking");
    };
    // Ensure the booking owner is set to the caller
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

  // Get booking by PNR - users can only view their own bookings, admins can view all
  public query ({ caller }) func getBooking(pnr : Text) : async ?Booking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };
    switch (bookings.get(pnr)) {
      case (?booking) {
        if (booking.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?booking;
        } else {
          Runtime.trap("Unauthorized: Can only view your own bookings");
        };
      };
      case null { null };
    };
  };

  // Get all bookings - users see only their bookings, admins see all
  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };
    if (AccessControl.isAdmin(accessControlState, caller)) {
      bookings.values().toArray();
    } else {
      let result = List.empty<Booking>();
      let bookingsIter = bookings.values();
      for (booking in bookingsIter) {
        if (booking.owner == caller) {
          result.add(booking);
        };
      };
      result.toArray();
    };
  };

  // Cancel booking by PNR - users can only cancel their own bookings, admins can cancel any
  public shared ({ caller }) func cancelBooking(pnr : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel bookings");
    };
    switch (bookings.get(pnr)) {
      case (?booking) {
        if (booking.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          bookings.remove(pnr);
          true;
        } else {
          Runtime.trap("Unauthorized: Can only cancel your own bookings");
        };
      };
      case null { false };
    };
  };

  // Get bookings by train number - users see only their bookings, admins see all
  public query ({ caller }) func getBookingsByTrainNumber(trainNumber : Text) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };
    let result = List.empty<Booking>();
    let bookingsIter = bookings.values();
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    for (booking in bookingsIter) {
      if (booking.trainDetails.trainNumber == trainNumber) {
        if (isAdmin or booking.owner == caller) {
          result.add(booking);
        };
      };
    };
    result.toArray();
  };

  // Get bookings by passenger name - users see only their bookings, admins see all
  public query ({ caller }) func getBookingsByPassengerName(name : Text) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };
    let result = List.empty<Booking>();
    let bookingsIter = bookings.values();
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    for (booking in bookingsIter) {
      let passengersIter = booking.passengers.values();
      let hasPassenger = passengersIter.any(func(p) { p.name == name });
      if (hasPassenger) {
        if (isAdmin or booking.owner == caller) {
          result.add(booking);
        };
      };
    };
    result.toArray();
  };

  // Get bookings by journey date - users see only their bookings, admins see all
  public query ({ caller }) func getBookingsByDate(date : Text) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };
    let result = List.empty<Booking>();
    let bookingsIter = bookings.values();
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    for (booking in bookingsIter) {
      if (booking.travelDate == date) {
        if (isAdmin or booking.owner == caller) {
          result.add(booking);
        };
      };
    };
    result.toArray();
  };

  // Get confirmed bookings - users see only their bookings, admins see all
  public query ({ caller }) func getConfirmedBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };
    let result = List.empty<Booking>();
    let bookingsIter = bookings.values();
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    for (booking in bookingsIter) {
      switch (booking.status) {
        case (#confirmed) {
          if (isAdmin or booking.owner == caller) {
            result.add(booking);
          };
        };
        case (_) {};
      };
    };
    result.toArray();
  };

  // Get waiting list bookings - users see only their bookings, admins see all
  public query ({ caller }) func getWaitingBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };
    let result = List.empty<Booking>();
    let bookingsIter = bookings.values();
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    for (booking in bookingsIter) {
      switch (booking.status) {
        case (#waiting(_)) {
          if (isAdmin or booking.owner == caller) {
            result.add(booking);
          };
        };
        case (_) {};
      };
    };
    result.toArray();
  };

  // Get total bookings count - admin only (system statistics)
  public query ({ caller }) func getTotalBookingsCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view system statistics");
    };
    bookings.size();
  };

  // Get bookings count by class - admin only (system statistics)
  public query ({ caller }) func getBookingsCountByClass(bookingClass : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view system statistics");
    };
    var count = 0;
    let bookingsIter = bookings.values();
    for (booking in bookingsIter) {
      if (booking.bookingClass == bookingClass) {
        count += 1;
      };
    };
    count;
  };

  // Get bookings count by quota - admin only (system statistics)
  public query ({ caller }) func getBookingsCountByQuota(quota : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view system statistics");
    };
    var count = 0;
    let bookingsIter = bookings.values();
    for (booking in bookingsIter) {
      if (booking.quota == quota) {
        count += 1;
      };
    };
    count;
  };

};
