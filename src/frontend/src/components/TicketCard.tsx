import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Booking } from "@/utils/storage";
import { downloadTicketPDF } from "@/utils/ticketPdf";
import { Calendar, Download, MapPin, Train, Users } from "lucide-react";

interface TicketCardProps {
  booking: Booking;
  onDelete?: (pnr: string) => void;
  index?: number;
}

export default function TicketCard({
  booking,
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
          background: booking.status === "CONFIRMED" ? "#16a34a" : "#f97316",
        }}
      />
      <CardContent className="pt-5 pb-5">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              PNR Number
            </p>
            <p className="text-xl font-bold font-mono text-primary">
              {booking.pnr}
            </p>
          </div>
          <Badge
            className={
              booking.status === "CONFIRMED"
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-orange-100 text-orange-800 border-orange-200"
            }
          >
            {booking.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Train className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Train</p>
              <p className="font-medium">{booking.train.name}</p>
              <p className="text-xs text-muted-foreground">
                {booking.train.number}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Route</p>
              <p className="font-medium">
                {booking.train.from} → {booking.train.to}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Travel Date</p>
              <p className="font-medium">{booking.travelDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Passengers</p>
              <p className="font-medium">{booking.passengers.length}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs mb-4">
          <span className="bg-secondary px-2 py-1 rounded">
            Class: {booking.travelClass}
          </span>
          <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded">
            Quota: {booking.quota || "General"}
          </span>
        </div>

        {/* Passenger table */}
        <div className="mb-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                  #
                </th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                  Age
                </th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                  Gender
                </th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                  Coach
                </th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                  Seat
                </th>
              </tr>
            </thead>
            <tbody>
              {booking.passengers.map((p, i) => (
                <tr key={p.seat} className="border-t border-border">
                  <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-2 font-medium">{p.name}</td>
                  <td className="px-3 py-2">{p.age}</td>
                  <td className="px-3 py-2">{p.gender}</td>
                  <td className="px-3 py-2">{p.coach}</td>
                  <td className="px-3 py-2 font-mono">{p.seat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadTicketPDF(booking)}
            className="flex items-center gap-1"
            data-ocid={`ticket.download_button.${idx}`}
          >
            <Download className="h-3 w-3" /> Download PDF
          </Button>
          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(booking.pnr)}
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
