import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import type { Booking } from "./storage";

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
    `Class:${booking.travelClass} Quota:${booking.quota || "General"}`,
    `Status:${booking.status}`,
    `Passengers:${passengers}`,
  ].join(" | ");
}

async function getQRDataURL(booking: Booking): Promise<string> {
  return QRCode.toDataURL(buildQRData(booking), {
    width: 120,
    margin: 1,
    color: { dark: "#0a2c6e", light: "#ffffff" },
  });
}

async function renderTicketPage(
  doc: jsPDF,
  booking: Booking,
  qrCanvas: HTMLCanvasElement | null,
  barcodeEl: SVGSVGElement | null,
): Promise<void> {
  const W = 210;
  const BLUE = [10, 44, 110] as [number, number, number];
  const LIGHT_BLUE = [240, 244, 255] as [number, number, number];
  const ORANGE = [234, 88, 12] as [number, number, number];
  const GREEN = [22, 163, 74] as [number, number, number];
  const WHITE = [255, 255, 255] as [number, number, number];
  const GRAY = [100, 100, 100] as [number, number, number];

  // --- Header ---
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, W, 28, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("BHARTIYA RAILWAY TICKET SYSTEM", 14, 9);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("BRTS Official e-Ticket", 14, 20);
  // Booking date (right)
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Booked: ${new Date(booking.bookedAt).toLocaleDateString("en-IN")}`,
    W - 14,
    20,
    { align: "right" },
  );

  // --- PNR + Status bar ---
  doc.setFillColor(...LIGHT_BLUE);
  doc.rect(0, 28, W, 14, "F");
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.3);
  doc.line(0, 42, W, 42);
  doc.setTextColor(...GRAY);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("PNR NUMBER", 14, 33);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BLUE);
  doc.text(booking.pnr, 14, 40);
  // Status
  const isConfirmed = booking.status === "CONFIRMED";
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...(isConfirmed ? GREEN : ORANGE));
  doc.text(booking.status, W - 14, 33, { align: "right" });
  doc.setTextColor(...GRAY);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Class: ${booking.travelClass}  |  Quota: ${booking.quota || "General"}`,
    W - 14,
    40,
    { align: "right" },
  );

  // --- Train Info + Journey ---
  let y = 48;
  doc.setDrawColor(220, 228, 255);
  doc.setLineWidth(0.2);
  // Left column: Train
  doc.setFillColor(...LIGHT_BLUE);
  doc.rect(0, y, W / 2, 22, "F");
  doc.setTextColor(...GRAY);
  doc.setFontSize(6.5);
  doc.text("TRAIN INFORMATION", 14, y + 5);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BLUE);
  doc.text(booking.train.name, 14, y + 12);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text(
    `${booking.train.number}  |  ${booking.train.type}  |  ${booking.train.duration}`,
    14,
    y + 18,
  );
  // Right column: Journey
  doc.setFillColor(255, 255, 255);
  doc.rect(W / 2, y, W / 2, 22, "F");
  doc.setFontSize(6.5);
  doc.setTextColor(...GRAY);
  doc.setFont("helvetica", "normal");
  doc.text("JOURNEY DETAILS", W / 2 + 6, y + 5);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BLUE);
  doc.text(booking.train.from, W / 2 + 6, y + 12);
  doc.text(booking.train.to, W - 14, y + 12, { align: "right" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  const midX = W / 2 + W / 2 / 2;
  doc.text("→", midX, y + 12, { align: "center" });
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  doc.text(`Travel Date: ${booking.travelDate}`, W / 2 + 6, y + 18);

  y += 22;
  doc.setDrawColor(200, 210, 240);
  doc.setLineWidth(0.3);
  doc.line(0, y, W, y);

  // --- Passenger Table ---
  y += 4;
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text("PASSENGER DETAILS", 14, y);
  y += 4;

  const colX = [14, 22, 80, 100, 122, 148, 172];
  const _colW = [6, 56, 18, 20, 24, 22, 20];
  const headers = [
    "#",
    "Passenger Name",
    "Age",
    "Gender",
    "Coach",
    "Seat No.",
    "Berth",
  ];

  // Table header
  doc.setFillColor(...BLUE);
  doc.rect(14, y, W - 28, 7, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  headers.forEach((h, i) => doc.text(h, colX[i], y + 5));
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  for (const [i, p] of booking.passengers.entries()) {
    doc.setFillColor(
      i % 2 === 0 ? 255 : 240,
      i % 2 === 0 ? 255 : 244,
      i % 2 === 0 ? 255 : 255,
    );
    doc.rect(14, y, W - 28, 7, "F");
    doc.setTextColor(50, 50, 50);
    doc.text(String(i + 1), colX[0], y + 5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BLUE);
    doc.text(p.name, colX[1], y + 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(String(p.age), colX[2], y + 5);
    doc.text(p.gender, colX[3], y + 5);
    doc.text(p.coach, colX[4], y + 5);
    doc.text(String(p.seat), colX[5], y + 5);
    doc.text((p as any).berth || "-", colX[6], y + 5);
    y += 7;
  }
  doc.setDrawColor(200, 210, 240);
  doc.setLineWidth(0.3);
  doc.line(14, y, W - 14, y);

  y += 6;

  // --- QR + Barcode ---
  const qrDataURL = qrCanvas
    ? qrCanvas.toDataURL("image/png")
    : await getQRDataURL(booking);

  doc.addImage(qrDataURL, "PNG", 14, y, 30, 30);
  doc.setFontSize(6);
  doc.setTextColor(...GRAY);
  doc.setFont("helvetica", "normal");
  doc.text("Scan QR for details", 29, y + 33, { align: "center" });

  // Barcode
  if (barcodeEl) {
    const svgData = new XMLSerializer().serializeToString(barcodeEl);
    const encoded = btoa(unescape(encodeURIComponent(svgData)));
    const barcodeDataURL = `data:image/svg+xml;base64,${encoded}`;
    doc.addImage(barcodeDataURL, "SVG", 50, y + 4, 70, 18);
    doc.setFontSize(6);
    doc.setTextColor(...GRAY);
    doc.text(booking.pnr, 85, y + 27, { align: "center" });
  } else {
    // Fallback: draw PNR as text barcode label
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BLUE);
    doc.text(`||||| ${booking.pnr} |||||`, 85, y + 14, { align: "center" });
  }

  // --- Footer ---
  doc.setFillColor(...LIGHT_BLUE);
  doc.rect(0, 281, W, 8, "F");
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...GRAY);
  doc.text(
    "This is a computer-generated ticket. No signature required.",
    W / 2,
    286,
    { align: "center" },
  );
  doc.setFillColor(...BLUE);
  doc.rect(0, 289, W, 8, "F");
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...WHITE);
  doc.setFontSize(6.5);
  doc.text(
    "BRTS Official Ticket Booking  |  Bhartiya Railway Ticket System",
    W / 2,
    294,
    { align: "center" },
  );
}

export async function downloadTicketPDF(
  booking: Booking,
  qrCanvas?: HTMLCanvasElement | null,
  barcodeEl?: SVGSVGElement | null,
): Promise<void> {
  const doc = new jsPDF();
  await renderTicketPage(doc, booking, qrCanvas ?? null, barcodeEl ?? null);
  doc.save(`BRTS_Ticket_${booking.pnr}.pdf`);
}

export async function downloadAllTicketsPDF(
  bookings: Booking[],
): Promise<void> {
  if (bookings.length === 0) return;
  const doc = new jsPDF();
  for (const [i, booking] of bookings.entries()) {
    if (i > 0) doc.addPage();
    await renderTicketPage(doc, booking, null, null);
  }
  doc.save(`BRTS_All_Tickets_${new Date().toISOString().split("T")[0]}.pdf`);
}
