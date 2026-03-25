/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

export const Ticket = IDL.Record({
  'pnr' : IDL.Text,
  'status' : IDL.Text,
  'passengerGender' : IDL.Text,
  'trainNumber' : IDL.Text,
  'trainDuration' : IDL.Text,
  'bookedAt' : IDL.Text,
  'coach' : IDL.Text,
  'seat' : IDL.Nat,
  'trainFrom' : IDL.Text,
  'trainName' : IDL.Text,
  'trainType' : IDL.Text,
  'passengerName' : IDL.Text,
  'trainTo' : IDL.Text,
  'travelDate' : IDL.Text,
  'travelClass' : IDL.Text,
  'passengerAge' : IDL.Text,
});

export const idlService = IDL.Service({
  'deleteTicket' : IDL.Func([IDL.Text], [], []),
  'getAllTickets' : IDL.Func([], [IDL.Vec(Ticket)], ['query']),
  'getTicketByPnr' : IDL.Func([IDL.Text], [IDL.Opt(Ticket)], ['query']),
  'saveTicket' : IDL.Func([Ticket], [], []),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const Ticket = IDL.Record({
    'pnr' : IDL.Text,
    'status' : IDL.Text,
    'passengerGender' : IDL.Text,
    'trainNumber' : IDL.Text,
    'trainDuration' : IDL.Text,
    'bookedAt' : IDL.Text,
    'coach' : IDL.Text,
    'seat' : IDL.Nat,
    'trainFrom' : IDL.Text,
    'trainName' : IDL.Text,
    'trainType' : IDL.Text,
    'passengerName' : IDL.Text,
    'trainTo' : IDL.Text,
    'travelDate' : IDL.Text,
    'travelClass' : IDL.Text,
    'passengerAge' : IDL.Text,
  });
  return IDL.Service({
    'deleteTicket' : IDL.Func([IDL.Text], [], []),
    'getAllTickets' : IDL.Func([], [IDL.Vec(Ticket)], ['query']),
    'getTicketByPnr' : IDL.Func([IDL.Text], [IDL.Opt(Ticket)], ['query']),
    'saveTicket' : IDL.Func([Ticket], [], []),
  });
};

export const init = ({ IDL }) => { return []; };
