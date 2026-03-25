import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Text "mo:core/Text";
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

  public type Ticket = {
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

  let userProfiles = Map.empty<Principal, UserProfile>();

  var ticketCounter = 0;
  let tickets = Map.empty<Nat, Ticket>();

  public type ContactMessage = {
    name : Text;
    email : Text;
    message : Text;
  };

  module ContactMessage {
    public func compare(a : ContactMessage, b : ContactMessage) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  var messageCounter = 0;
  let messages = Map.empty<Nat, ContactMessage>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public shared func submitMessage(message : ContactMessage) : async () {
    messages.add(messageCounter, message);
    messageCounter += 1;
  };

  public query ({ caller }) func listMessages() : async [ContactMessage] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view messages");
    };
    messages.values().toArray().sort();
  };

  public shared func saveTicket(ticket : Ticket) : async () {
    tickets.add(ticketCounter, ticket);
    ticketCounter += 1;
  };

  public query func getTicketByPnr(pnr : Text) : async ?Ticket {
    for ((_, ticket) in tickets.entries()) {
      if (ticket.pnr == pnr) {
        return ?ticket;
      };
    };
    null;
  };

  public query func getAllTickets() : async [Ticket] {
    tickets.values().toArray();
  };

  public shared func deleteTicket(pnr : Text) : async () {
    var keyToRemove : ?Nat = null;
    for ((key, ticket) in tickets.entries()) {
      if (ticket.pnr == pnr) {
        keyToRemove := ?key;
      };
    };
    switch (keyToRemove) {
      case (null) {};
      case (?key) { tickets.remove(key); };
    };
  };
};
