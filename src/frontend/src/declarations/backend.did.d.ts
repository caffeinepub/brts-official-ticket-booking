/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';

export interface Ticket {
  'pnr' : string,
  'status' : string,
  'passengerGender' : string,
  'trainNumber' : string,
  'trainDuration' : string,
  'bookedAt' : string,
  'coach' : string,
  'seat' : bigint,
  'trainFrom' : string,
  'trainName' : string,
  'trainType' : string,
  'passengerName' : string,
  'trainTo' : string,
  'travelDate' : string,
  'travelClass' : string,
  'passengerAge' : string,
}
export interface _SERVICE {
  'deleteTicket' : ActorMethod<[string], undefined>,
  'getAllTickets' : ActorMethod<[], Array<Ticket>>,
  'getTicketByPnr' : ActorMethod<[string], [] | [Ticket]>,
  'saveTicket' : ActorMethod<[Ticket], undefined>,
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
