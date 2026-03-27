import { type TravelClass, classLabel } from "@/components/SeatLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/utils/storage";
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

function generateTicketPDF(booking: Booking) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const isGeneral = booking.travelClass === "General";
  const pageW = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;

  // Header background
  doc.setFillColor(10, 44, 110);
  doc.rect(0, 0, pageW, 30, "F");

  // Header text
  doc.setTextColor(170, 196, 255);
  doc.setFontSize(8);
  doc.text("BHARTIYA RAILWAY TICKET SYSTEM", margin, 10);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("BRTS Official e-Ticket", margin, 22);

  // Booking date top right
  doc.setTextColor(170, 196, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Booked: ${new Date(booking.bookedAt).toLocaleDateString("en-IN")}`,
    pageW - margin,
    22,
    { align: "right" },
  );

  // PNR bar
  doc.setFillColor(240, 244, 255);
  doc.rect(0, 30, pageW, 20, "F");
  doc.setDrawColor(200, 216, 240);
  doc.line(0, 50, pageW, 50);

  doc.setTextColor(10, 44, 110);
  doc.setFontSize(18);
  doc.setFont("courier", "bold");
  doc.text(booking.pnr, margin, 44);

  // Status badge
  const isConfirmed = booking.status === "CONFIRMED";
  doc.setFillColor(
    isConfirmed ? 220 : 255,
    isConfirmed ? 252 : 243,
    isConfirmed ? 231 : 224,
  );
  doc.setDrawColor(
    isConfirmed ? 134 : 253,
    isConfirmed ? 239 : 186,
    isConfirmed ? 172 : 116,
  );
  doc.roundedRect(80, 35, 30, 9, 2, 2, "FD");
  doc.setTextColor(
    isConfirmed ? 22 : 154,
    isConfirmed ? 101 : 52,
    isConfirmed ? 52 : 18,
  );
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(booking.status, 95, 41, { align: "center" });

  // Class + Quota right side
  doc.setTextColor(85, 85, 85);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Class: ${classLabel(booking.travelClass as TravelClass)}`,
    pageW - margin,
    37,
    { align: "right" },
  );
  doc.text(
    `Quota: ${quotaLabel(booking.quota || "General")}`,
    pageW - margin,
    44,
    { align: "right" },
  );

  // Section: Train Info
  let y = 58;
  doc.setFillColor(248, 250, 255);
  doc.rect(margin, y, contentW / 2 - 4, 28, "F");
  doc.setDrawColor(224, 234, 255);
  doc.rect(margin, y, contentW / 2 - 4, 28);

  doc.setTextColor(170, 170, 170);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("TRAIN INFORMATION", margin + 3, y + 6);
  doc.setTextColor(10, 44, 110);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(booking.train.name, margin + 3, y + 14);
  doc.setTextColor(68, 68, 68);
  doc.setFontSize(9);
  doc.setFont("courier", "normal");
  doc.text(booking.train.number, margin + 3, y + 20);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${booking.train.type} • ${booking.train.duration}`,
    margin + 3,
    y + 26,
  );

  // Section: Journey Details
  const col2x = margin + contentW / 2 + 4;
  doc.setFillColor(255, 255, 255);
  doc.rect(col2x, y, contentW / 2 - 4, 28, "F");
  doc.setDrawColor(224, 234, 255);
  doc.rect(col2x, y, contentW / 2 - 4, 28);

  doc.setTextColor(170, 170, 170);
  doc.setFontSize(7);
  doc.text("JOURNEY DETAILS", col2x + 3, y + 6);
  doc.setTextColor(10, 44, 110);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`${booking.train.from}  ->  ${booking.train.to}`, col2x + 3, y + 16);
  doc.setTextColor(85, 85, 85);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Travel Date: ${booking.travelDate}`, col2x + 3, y + 24);

  // Passenger table
  y += 34;
  doc.setTextColor(170, 170, 170);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("PASSENGER DETAILS", margin, y);
  y += 4;

  // Table header
  const cols = [
    "#",
    "Passenger Name",
    "Age",
    "Gender",
    "Coach",
    "Seat No.",
    "Berth",
  ];
  const colWidths = [8, 50, 12, 18, 18, 22, 52];
  const rowH = 8;
  doc.setFillColor(10, 44, 110);
  doc.rect(margin, y, contentW, rowH, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  let cx = margin + 2;
  cols.forEach((col, i) => {
    doc.text(col, cx, y + 5.5);
    cx += colWidths[i];
  });
  y += rowH;

  // Table rows
  booking.passengers.forEach((p, i) => {
    doc.setFillColor(
      i % 2 === 0 ? 255 : 240,
      i % 2 === 0 ? 255 : 244,
      i % 2 === 0 ? 255 : 255,
    );
    doc.rect(margin, y, contentW, rowH, "F");
    doc.setDrawColor(224, 234, 255);
    doc.rect(margin, y, contentW, rowH);
    doc.setTextColor(68, 68, 68);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const rowData = [
      String(i + 1),
      p.name,
      String(p.age),
      p.gender,
      isGeneral ? "GN" : p.coach || "-",
      isGeneral ? "N/A" : p.seat || "-",
      isGeneral ? "General - No Seat" : (p as any).berth || "-",
    ];
    cx = margin + 2;
    rowData.forEach((val, j) => {
      doc.text(val, cx, y + 5.5);
      cx += colWidths[j];
    });
    y += rowH;
  });

  // Footer
  y += 8;
  doc.setFillColor(240, 244, 255);
  doc.rect(0, y, pageW, 12, "F");
  doc.setTextColor(136, 136, 136);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    "This is a computer-generated ticket. No signature required.",
    pageW / 2,
    y + 7,
    { align: "center" },
  );

  doc.save(`BRTS_Ticket_${booking.pnr}.pdf`);
}

export default function TicketCard({
  booking,
  onDelete,
  index,
}: TicketCardProps) {
  const idx = index !== undefined ? index + 1 : 1;
  const ticketRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  function downloadTicket() {
    setDownloading(true);
    try {
      generateTicketPDF(booking);
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
