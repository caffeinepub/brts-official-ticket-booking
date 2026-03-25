/* eslint-disable */

// @ts-nocheck

import { Actor, HttpAgent, type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@icp-sdk/core/agent";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";

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

export interface backendInterface {
    deleteTicket(pnr: string): Promise<void>;
    getAllTickets(): Promise<Array<Ticket>>;
    getTicketByPnr(pnr: string): Promise<Ticket | null>;
    saveTicket(ticket: Ticket): Promise<void>;
}

import type { Ticket as _Ticket } from "./declarations/backend.did.d.ts";

export class Backend implements backendInterface {
    constructor(private actor: ActorSubclass<_SERVICE>, private _uploadFile: (file: any) => Promise<Uint8Array>, private _downloadFile: (file: Uint8Array) => Promise<any>, private processError?: (error: unknown) => never){}

    async deleteTicket(arg0: string): Promise<void> {
        if (this.processError) {
            try { return await this.actor.deleteTicket(arg0); } catch (e) { this.processError(e); throw new Error("unreachable"); }
        }
        return await this.actor.deleteTicket(arg0);
    }

    async getAllTickets(): Promise<Array<Ticket>> {
        if (this.processError) {
            try { return await this.actor.getAllTickets(); } catch (e) { this.processError(e); throw new Error("unreachable"); }
        }
        return await this.actor.getAllTickets();
    }

    async getTicketByPnr(arg0: string): Promise<Ticket | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getTicketByPnr(arg0);
                return result.length === 0 ? null : result[0];
            } catch (e) { this.processError(e); throw new Error("unreachable"); }
        }
        const result = await this.actor.getTicketByPnr(arg0);
        return result.length === 0 ? null : result[0];
    }

    async saveTicket(arg0: Ticket): Promise<void> {
        if (this.processError) {
            try { return await this.actor.saveTicket(arg0); } catch (e) { this.processError(e); throw new Error("unreachable"); }
        }
        return await this.actor.saveTicket(arg0);
    }
}

export interface CreateActorOptions {
    agent?: Agent;
    agentOptions?: HttpAgentOptions;
    actorOptions?: ActorConfig;
    processError?: (error: unknown) => never;
}

export class ExternalBlob {
    onProgress?: (percentage: number) => void = undefined;
    directURL: string;
    private _blob?: Uint8Array<ArrayBuffer> | null;
    private constructor(url: string, blob: Uint8Array<ArrayBuffer> | null) {
        this.directURL = url;
        if (blob) this._blob = blob;
    }
    static fromURL(url: string): ExternalBlob { return new ExternalBlob(url, null); }
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
        const url = URL.createObjectURL(new Blob([new Uint8Array(blob)], { type: 'application/octet-stream' }));
        return new ExternalBlob(url, blob);
    }
    async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
        if (this._blob) return this._blob;
        const response = await fetch(this.directURL);
        const blob = await response.blob();
        this._blob = new Uint8Array(await blob.arrayBuffer());
        return this._blob;
    }
    getDirectURL(): string { return this.directURL; }
}

export function createActor(canisterId: string, _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>, _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>, options: CreateActorOptions = {}): Backend {
    const agent = options.agent || HttpAgent.createSync({ ...options.agentOptions });
    const actor = Actor.createActor<_SERVICE>(idlFactory, { agent, canisterId, ...options.actorOptions });
    return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
