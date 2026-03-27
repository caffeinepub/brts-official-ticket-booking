import { jsPDF } from "jspdf";
import type { Booking } from "./storage";

function classLabel(c: string): string {
  switch (c) {
    case "Sleeper":
      return "SL - Sleeper";
    case "AC 3 Tier":
      return "3A - AC 3 Tier";
    case "AC 2 Tier":
      return "2A - AC 2 Tier";
    case "AC First Class":
      return "1A - AC First Class";
    case "General":
      return "GN - General";
    default:
      return c;
  }
}

function quotaLabel(q: string): string {
  if (q === "Tatkal") return "TQ - Tatkal";
  if (q === "Ladies") return "LD - Ladies";
  return "GN - General";
}

// ─── Single Ticket PDF ───────────────────────────────────────────────────────

export function downloadTicketPDF(booking: Booking): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const isGeneral = booking.travelClass === "General";
  const pageW = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;

  // Header
  doc.setFillColor(10, 44, 110);
  doc.rect(0, 0, pageW, 30, "F");
  doc.setTextColor(170, 196, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("BHARTIYA RAILWAY TICKET SYSTEM", margin, 10);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("BRTS Official e-Ticket", margin, 22);
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
  doc.roundedRect(80, 35, 32, 9, 2, 2, "FD");
  doc.setTextColor(
    isConfirmed ? 22 : 154,
    isConfirmed ? 101 : 52,
    isConfirmed ? 52 : 18,
  );
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(booking.status, 96, 41, { align: "center" });

  doc.setTextColor(85, 85, 85);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Class: ${classLabel(booking.travelClass)}`, pageW - margin, 37, {
    align: "right",
  });
  doc.text(
    `Quota: ${quotaLabel(booking.quota || "General")}`,
    pageW - margin,
    44,
    { align: "right" },
  );

  // Train + Journey
  let y = 58;
  const half = contentW / 2 - 4;
  doc.setFillColor(248, 250, 255);
  doc.rect(margin, y, half, 28, "F");
  doc.setDrawColor(224, 234, 255);
  doc.rect(margin, y, half, 28);
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
    `${booking.train.type} - ${booking.train.duration}`,
    margin + 3,
    y + 26,
  );

  const col2x = margin + contentW / 2 + 4;
  doc.setFillColor(255, 255, 255);
  doc.rect(col2x, y, half, 28, "F");
  doc.setDrawColor(224, 234, 255);
  doc.rect(col2x, y, half, 28);
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

  const cols = [
    "#",
    "Passenger Name",
    "Age",
    "Gender",
    "Coach",
    "Seat No.",
    "Berth",
  ];
  const colW = [8, 50, 12, 18, 18, 22, 52];
  const rowH = 8;
  doc.setFillColor(10, 44, 110);
  doc.rect(margin, y, contentW, rowH, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  let cx = margin + 2;
  for (let i = 0; i < cols.length; i++) {
    doc.text(cols[i], cx, y + 5.5);
    cx += colW[i];
  }
  y += rowH;

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
    const row = [
      String(i + 1),
      p.name,
      String(p.age),
      p.gender,
      isGeneral ? "GN" : p.coach || "-",
      isGeneral ? "N/A" : p.seat || "-",
      isGeneral
        ? "General - No Seat"
        : (p as unknown as Record<string, string>).berth || "-",
    ];
    cx = margin + 2;
    for (let j = 0; j < row.length; j++) {
      doc.text(String(row[j]), cx, y + 5.5);
      cx += colW[j];
    }
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

// ─── All Tickets PDF ─────────────────────────────────────────────────────────

export function downloadAllTicketsPDF(bookings: Booking[]): void {
  if (bookings.length === 0) return;

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const pageW = 297;
  const margin = 10;
  const contentW = pageW - margin * 2;
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const waiting = bookings.length - confirmed;

  // Header
  doc.setFillColor(10, 44, 110);
  doc.rect(0, 0, pageW, 25, "F");
  doc.setTextColor(170, 196, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("ADMIN REPORT", margin, 8);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("BRTS Official Ticket Booking - All Tickets Report", margin, 18);
  doc.setTextColor(170, 196, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated: ${new Date().toLocaleString("en-IN")}`,
    pageW - margin,
    18,
    { align: "right" },
  );

  // Summary
  let y = 30;
  doc.setFillColor(238, 242, 255);
  doc.rect(0, y, pageW, 12, "F");
  doc.setDrawColor(200, 216, 240);
  doc.line(0, y + 12, pageW, y + 12);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 44, 110);
  doc.text(`Total Tickets: ${bookings.length}`, margin + 5, y + 8);
  doc.setTextColor(22, 101, 52);
  doc.text(`Confirmed: ${confirmed}`, margin + 55, y + 8);
  doc.setTextColor(154, 52, 18);
  doc.text(`Waiting List: ${waiting}`, margin + 105, y + 8);

  // Table
  y += 16;
  const headers = [
    "PNR",
    "Name",
    "Train",
    "Route",
    "Date",
    "Class",
    "Quota",
    "Coach",
    "Seat",
    "Status",
  ];
  const colW = [28, 30, 38, 32, 22, 28, 22, 16, 16, 22];
  const rowH = 7;

  doc.setFillColor(10, 44, 110);
  doc.rect(margin, y, contentW, rowH, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  let cx = margin + 2;
  for (let i = 0; i < headers.length; i++) {
    doc.text(headers[i], cx, y + 4.8);
    cx += colW[i];
  }
  y += rowH;

  const pageH = 210; // landscape height
  bookings.forEach((b, i) => {
    if (y + rowH > pageH - 15) {
      doc.addPage();
      y = 15;
    }
    doc.setFillColor(i % 2 === 0 ? 248 : 238, i % 2 === 0 ? 250 : 242, 255);
    doc.rect(margin, y, contentW, rowH, "F");
    doc.setDrawColor(224, 234, 255);
    doc.rect(margin, y, contentW, rowH);
    doc.setTextColor(34, 34, 34);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    const row = [
      b.pnr,
      b.passengers[0]?.name ?? "-",
      `${b.train.number} ${b.train.name}`,
      `${b.train.from} -> ${b.train.to}`,
      b.travelDate,
      classLabel(b.travelClass),
      quotaLabel(b.quota || "General"),
      b.passengers[0]?.coach ?? "-",
      b.travelClass === "General" ? "N/A" : (b.passengers[0]?.seat ?? "-"),
      b.status,
    ];
    cx = margin + 2;
    for (let j = 0; j < row.length; j++) {
      doc.text(String(row[j]), cx, y + 4.8);
      cx += colW[j];
    }
    y += rowH;
  });

  // Footer
  y += 6;
  doc.setFillColor(10, 44, 110);
  doc.rect(0, y, pageW, 10, "F");
  doc.setTextColor(170, 196, 255);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "italic");
  doc.text(
    "This is a computer-generated report. BRTS Official Ticket Booking - Bhartiya Railway Ticket System",
    pageW / 2,
    y + 6.5,
    { align: "center" },
  );

  const dateStr = new Date().toISOString().split("T")[0];
  doc.save(`BRTS_All_Tickets_${dateStr}.pdf`);
}
