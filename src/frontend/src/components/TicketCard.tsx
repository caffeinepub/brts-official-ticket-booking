import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Ticket } from "@/utils/storage";
import { downloadTicketPDF } from "@/utils/ticketPdf";
import { Calendar, Download, MapPin, Train, User } from "lucide-react";

interface TicketCardProps {
  ticket: Ticket;
  onDelete?: (pnr: string) => void;
  index?: number;
}

export default function TicketCard({
  ticket,
  onDelete,
  index,
}: TicketCardProps) {
  const idx = index !== undefined ? index + 1 : 1;
  return (
    <Card
      className="overflow-hidden border-border shadow-sm"
      data-ocid={`ticket.item.${idx}`}
    >
      <div
        className="h-2"
        style={{
          background: ticket.status === "CONFIRMED" ? "#16a34a" : "#f97316",
        }}
      />
      <CardContent className="pt-5 pb-5">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              PNR Number
            </p>
            <p className="text-xl font-bold font-mono text-primary">
              {ticket.pnr}
            </p>
          </div>
          <Badge
            className={
              ticket.status === "CONFIRMED"
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-orange-100 text-orange-800 border-orange-200"
            }
          >
            {ticket.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Passenger</p>
              <p className="font-medium">{ticket.passenger.name}</p>
              <p className="text-xs text-muted-foreground">
                {ticket.passenger.age}yr · {ticket.passenger.gender}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Train className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Train</p>
              <p className="font-medium">{ticket.train.name}</p>
              <p className="text-xs text-muted-foreground">
                {ticket.train.number}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Route</p>
              <p className="font-medium">
                {ticket.train.from} → {ticket.train.to}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Travel Date</p>
              <p className="font-medium">{ticket.travelDate}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs mb-4">
          <span className="bg-secondary px-2 py-1 rounded">
            Class: {ticket.travelClass}
          </span>
          <span className="bg-secondary px-2 py-1 rounded">
            Coach: {ticket.coach}
          </span>
          <span className="bg-secondary px-2 py-1 rounded">
            Seat: {ticket.seat}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadTicketPDF(ticket)}
            className="flex items-center gap-1"
            data-ocid={`ticket.download_button.${idx}`}
          >
            <Download className="h-3 w-3" /> Download PDF
          </Button>
          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(ticket.pnr)}
              data-ocid={`ticket.delete_button.${idx}`}
            >
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
