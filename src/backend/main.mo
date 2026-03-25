import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";

actor {

  // ── Preserved stable variables from previous version (required for upgrade compatibility) ──
  let accessControlState = AccessControl.initState();

  type UserProfile_Legacy = { name : Text; email : Text; phone : Text };
  type ContactMessage_Legacy = { name : Text; email : Text; message : Text };

  let userProfiles = Map.empty<Principal, UserProfile_Legacy>();
  var messageCounter = 0;
  let messages = Map.empty<Nat, ContactMessage_Legacy>();
  // ────────────────────────────────────────────────────────────────────────────

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

  var ticketCounter = 0;
  let tickets = Map.empty<Nat, Ticket>();

  public shared func saveTicket(ticket : Ticket) : async () {
    tickets.add(ticketCounter, ticket);
    ticketCounter += 1;
  };

  public query func getAllTickets() : async [Ticket] {
    tickets.values().toArray();
  };

  public query func getTicketByPnr(pnr : Text) : async ?Ticket {
    for ((_, ticket) in tickets.entries()) {
      if (ticket.pnr == pnr) {
        return ?ticket;
      };
    };
    null;
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
