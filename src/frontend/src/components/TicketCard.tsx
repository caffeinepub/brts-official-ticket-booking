import { type TravelClass, classLabel } from "@/components/SeatLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/utils/storage";
import { downloadTicketPDF } from "@/utils/ticketPdf";
import { Download, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

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

function buildQRData(booking: Booking): string {
  const passengers = booking.passengers
    .map(
      (p) => `${p.name} (${p.age}/${p.gender}) Coach:${p.coach} Seat:${p.seat}`,
    )
    .join("; ");
  return [
    `PNR:${booking.pnr}`,
    `Train:${booking.train.number} - ${booking.train.name}`,
    `From:${booking.train.from} To:${booking.train.to}`,
    `Date:${booking.travelDate}`,
    `Class:${classLabel(booking.travelClass as TravelClass)} Quota:${quotaLabel(booking.quota || "General")}`,
    `Status:${booking.status}`,
    `Passengers:${passengers}`,
  ].join(" | ");
}

// Load QRCode library from CDN
function ensureQRLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).QRCode) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

/**
 * Simple barcode rendered as canvas using a pseudo-bar pattern from the PNR digits.
 */
function SimpleBarcodeCanvas({
  value,
  canvasRef,
}: {
  value: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const barWidth = 2;
    const height = 40;
    const quietZone = 8;
    const bars: boolean[] = [];
    bars.push(true, false, true, true, false, false, true, false, true, true);
    for (const ch of value) {
      const code = ch.charCodeAt(0);
      for (let b = 6; b >= 0; b--) {
        bars.push(((code >> b) & 1) === 1);
      }
      bars.push(false);
    }
    bars.push(
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      true,
      true,
    );
    const totalWidth = bars.length * barWidth + quietZone * 2;
    canvas.width = totalWidth;
    canvas.height = height;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, totalWidth, height);
    bars.forEach((filled, i) => {
      if (filled) {
        ctx.fillStyle = "#0a2c6e";
        ctx.fillRect(quietZone + i * barWidth, 0, barWidth, height);
      }
    });
  }, [value, canvasRef]);

  return <canvas ref={canvasRef} style={{ imageRendering: "pixelated" }} />;
}

export default function TicketCard({
  booking,
  onDelete,
  index,
}: TicketCardProps) {
  const idx = index !== undefined ? index + 1 : 1;
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const barcodeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = qrContainerRef.current;
    if (!container) return;
    // Clear previous QR
    container.innerHTML = "";
    ensureQRLoaded().then(() => {
      if (!qrContainerRef.current) return;
      qrContainerRef.current.innerHTML = "";
      const QRCode = (window as any).QRCode;
      const qr = new QRCode(qrContainerRef.current, {
        text: buildQRData(booking),
        width: 100,
        height: 100,
        colorDark: "#0a2c6e",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M,
      });
      // Store canvas ref for PDF
      setTimeout(() => {
        const canvas = qrContainerRef.current?.querySelector("canvas");
        if (canvas && qrCanvasRef.current !== canvas) {
          (qrCanvasRef as any).current = canvas;
        }
      }, 100);
      return () => qr;
    });
  }, [booking]);

  const isConfirmed = booking.status === "CONFIRMED";

  return (
    <div
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
                    {booking.travelClass === "General" ? "GN" : p.coach}
                  </td>
                  <td className="px-3 py-2 font-mono font-bold text-gray-800">
                    {booking.travelClass === "General"
                      ? "Not Applicable"
                      : p.seat}
                  </td>
                  <td className="px-3 py-2 text-gray-600 text-xs">
                    {booking.travelClass === "General"
                      ? "General \u2013 No Seat"
                      : (p as any).berth || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR + Barcode + Actions */}
      <div className="px-5 py-4 flex flex-wrap items-end justify-between gap-4 bg-white">
        <div className="flex items-end gap-6">
          <div className="text-center">
            <div ref={qrContainerRef} className="block" />
            <div className="text-[9px] text-gray-400 mt-1">
              Scan QR for details
            </div>
          </div>
          <div className="text-center">
            <SimpleBarcodeCanvas value={booking.pnr} canvasRef={barcodeRef} />
            <div className="text-[9px] text-gray-400 font-mono tracking-widest">
              {booking.pnr}
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            size="sm"
            className="bg-[#0a2c6e] hover:bg-[#0d3a8e] text-white flex items-center gap-1"
            onClick={() =>
              downloadTicketPDF(
                booking,
                qrContainerRef.current?.querySelector("canvas") ?? null,
                barcodeRef.current,
              )
            }
            data-ocid={`ticket.download_button.${idx}`}
          >
            <Download className="h-3 w-3" /> Download PDF
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
