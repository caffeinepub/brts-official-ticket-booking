import { type TravelClass, classLabel } from "@/components/SeatLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/utils/storage";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Download, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

interface TicketCardProps {
  booking: Booking;
  onDelete?: (pnr: string) => void;
  index?: number;
}

function quotaLabel(q: string): string {
  if (q === "Tatkal") return "TQ - Tatkal";
  if (q === "Ladies") return "LD - Ladies";
  return "GN - General";
}

export default function TicketCard({
  booking,
  onDelete,
  index,
}: TicketCardProps) {
  const idx = index !== undefined ? index + 1 : 1;
  const ticketRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function downloadTicket() {
    if (!ticketRef.current) return;
    setDownloading(true);
    try {
      await new Promise((r) => setTimeout(r, 200));
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF({
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });
      doc.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      doc.save(`BRTS_Ticket_${booking.pnr}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  const isConfirmed = booking.status === "CONFIRMED";
  const isGeneral = booking.travelClass === "General";

  return (
    <div
      id="ticket"
      ref={ticketRef}
      className="bg-white border border-blue-200 rounded-lg overflow-hidden shadow-md font-sans"
      style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}
      data-ocid={`ticket.item.${idx}`}
    >
      {/* Header */}
      <div className="bg-[#0a2c6e] text-white px-5 py-3 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase opacity-80">
            Bhartiya Railway Ticket System
          </div>
          <div className="text-lg font-bold tracking-wide">
            BRTS Official e-Ticket
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-70">Booking Date</div>
          <div className="text-sm font-semibold">
            {new Date(booking.bookedAt).toLocaleDateString("en-IN")}
          </div>
        </div>
      </div>

      {/* PNR + Status bar */}
      <div className="bg-[#f0f4ff] border-b border-blue-200 px-5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              PNR Number
            </span>
            <div className="text-xl font-bold font-mono text-[#0a2c6e] tracking-widest">
              {booking.pnr}
            </div>
          </div>
          <div className="h-8 w-px bg-blue-200" />
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              Status
            </span>
            <div>
              <Badge
                className={
                  isConfirmed
                    ? "bg-green-100 text-green-800 border border-green-300 text-xs font-bold px-3"
                    : "bg-orange-100 text-orange-800 border border-orange-300 text-xs font-bold px-3"
                }
              >
                {booking.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="text-right text-xs text-gray-500">
          <div>
            Class:{" "}
            <span className="font-semibold text-gray-700">
              {classLabel(booking.travelClass as TravelClass)}
            </span>
          </div>
          <div>
            Quota:{" "}
            <span className="font-semibold text-gray-700">
              {quotaLabel(booking.quota || "General")}
            </span>
          </div>
        </div>
      </div>

      {/* Train Info + Journey Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-b border-blue-100">
        <div className="px-5 py-3 border-b sm:border-b-0 sm:border-r border-blue-100">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            Train Information
          </div>
          <div className="text-base font-bold text-[#0a2c6e]">
            {booking.train.name}
          </div>
          <div className="text-sm text-gray-600 font-mono">
            {booking.train.number}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {booking.train.type} &bull; {booking.train.duration}
          </div>
        </div>
        <div className="px-5 py-3">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            Journey Details
          </div>
          <div className="flex items-center gap-2">
            <div className="text-center">
              <div className="text-sm font-bold text-[#0a2c6e]">
                {booking.train.from}
              </div>
              <div className="text-[10px] text-gray-400">ORIGIN</div>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-blue-300 mx-1 relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-blue-400 text-xs">
                &#8594;
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-[#0a2c6e]">
                {booking.train.to}
              </div>
              <div className="text-[10px] text-gray-400">DESTINATION</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Travel Date:{" "}
            <span className="font-semibold text-gray-800">
              {booking.travelDate}
            </span>
          </div>
        </div>
      </div>

      {/* Passenger Table */}
      <div className="px-5 py-3 border-b border-blue-100">
        <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
          Passenger Details
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#0a2c6e] text-white">
                <th className="text-left px-3 py-2 text-xs font-semibold">#</th>
                <th className="text-left px-3 py-2 text-xs font-semibold">
                  Passenger Name
                </th>
                <th className="text-left px-3 py-2 text-xs font-semibold">
                  Age
                </th>
                <th className="text-left px-3 py-2 text-xs font-semibold">
                  Gender
                </th>
                <th className="text-left px-3 py-2 text-xs font-semibold">
                  Coach
                </th>
                <th className="text-left px-3 py-2 text-xs font-semibold">
                  Seat No.
                </th>
                <th className="text-left px-3 py-2 text-xs font-semibold">
                  Berth
                </th>
              </tr>
            </thead>
            <tbody>
              {booking.passengers.map((p, i) => (
                <tr
                  key={`${p.seat}-${i}`}
                  className={i % 2 === 0 ? "bg-white" : "bg-[#f0f4ff]"}
                >
                  <td className="px-3 py-2 text-gray-500 text-xs">{i + 1}</td>
                  <td className="px-3 py-2 font-semibold text-[#0a2c6e]">
                    {p.name}
                  </td>
                  <td className="px-3 py-2 text-gray-700">{p.age}</td>
                  <td className="px-3 py-2 text-gray-700">{p.gender}</td>
                  <td className="px-3 py-2 font-mono font-bold text-gray-800">
                    {isGeneral ? "GN" : p.coach}
                  </td>
                  <td className="px-3 py-2 font-mono font-bold text-gray-800">
                    {isGeneral ? "Not Applicable" : p.seat}
                  </td>
                  <td className="px-3 py-2 text-gray-600 text-xs">
                    {isGeneral
                      ? "General \u2013 No Seat"
                      : (p as any).berth || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 flex flex-wrap items-center justify-end gap-2 bg-white">
        <Button
          size="sm"
          className="bg-[#0a2c6e] hover:bg-[#0d3a8e] text-white flex items-center gap-1"
          onClick={downloadTicket}
          disabled={downloading}
          data-ocid={`ticket.download_button.${idx}`}
        >
          <Download className="h-3 w-3" />
          {downloading ? "Generating..." : "Download PDF"}
        </Button>
        {onDelete && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(booking.pnr)}
            className="flex items-center gap-1"
            data-ocid={`ticket.delete_button.${idx}`}
          >
            <Trash2 className="h-3 w-3" /> Delete
          </Button>
        )}
      </div>

      {/* Footer */}
      <div className="bg-[#f0f4ff] border-t border-blue-200 px-5 py-2 text-center">
        <p className="text-[10px] text-gray-500 italic">
          This is a computer-generated ticket. No signature required.
        </p>
      </div>
    </div>
  );
}
