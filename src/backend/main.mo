import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
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

  stable var messageCounter : Nat = 0;
  let messages = Map.empty<Nat, ContactMessage>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Public endpoint - no authentication required (guests can submit)
  public shared func submitMessage(message : ContactMessage) : async () {
    messages.add(messageCounter, message);
    messageCounter += 1;
  };

  // Admin-only endpoint to view all submitted messages
  public query ({ caller }) func listMessages() : async [ContactMessage] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view messages");
    };
    messages.values().toArray().sort();
  };
};
