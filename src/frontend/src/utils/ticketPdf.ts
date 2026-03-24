import { jsPDF } from "jspdf";
import type { Ticket } from "./storage";

export function downloadTicketPDF(ticket: Ticket): void {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(26, 86, 219);
  doc.rect(0, 0, 210, 35, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("BRTS Official Ticket", 20, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Bhartiya Railway Ticket System", 20, 28);

  // PNR Badge
  doc.setFillColor(249, 115, 22);
  doc.rect(0, 35, 210, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(`PNR: ${ticket.pnr}`, 20, 44);

  // Details
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const lineH = 10;
  let y = 60;
  const col1 = 20;
  const col2 = 90;

  const addRow = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, col1, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, col2, y);
    y += lineH;
  };

  addRow("Passenger:", ticket.passenger.name);
  addRow(
    "Age / Gender:",
    `${ticket.passenger.age} / ${ticket.passenger.gender}`,
  );
  y += 3;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, 190, y);
  y += 6;

  addRow("Train:", `${ticket.train.number} - ${ticket.train.name}`);
  addRow("Type:", ticket.train.type);
  addRow("From:", ticket.train.from);
  addRow("To:", ticket.train.to);
  addRow("Duration:", ticket.train.duration);
  y += 3;
  doc.line(20, y, 190, y);
  y += 6;

  addRow("Travel Date:", ticket.travelDate);
  addRow("Class:", ticket.travelClass);
  addRow("Coach:", ticket.coach);
  addRow("Seat No:", ticket.seat.toString());
  y += 3;
  doc.line(20, y, 190, y);
  y += 6;

  // Status
  doc.setFont("helvetica", "bold");
  doc.text("Status:", col1, y);
  if (ticket.status === "CONFIRMED") {
    doc.setTextColor(22, 163, 74);
  } else {
    doc.setTextColor(234, 88, 12);
  }
  doc.text(ticket.status, col2, y);
  doc.setTextColor(30, 30, 30);
  y += lineH + 3;

  doc.line(20, y, 190, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Booked At: ${new Date(ticket.bookedAt).toLocaleString()}`, col1, y);

  // Footer
  doc.setFillColor(26, 86, 219);
  doc.rect(0, 275, 210, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text("BRTS Official Ticket Booking | www.brts.in", 20, 285);
  doc.text(
    `© ${new Date().getFullYear()} Bhartiya Railway Ticket System`,
    20,
    292,
  );

  doc.save(`BRTS_Ticket_${ticket.pnr}.pdf`);
}

/**
 * Downloads all tickets as a single multi-page PDF.
 * Each ticket occupies one page.
 */
export function downloadAllTicketsPDF(tickets: Ticket[]): void {
  if (tickets.length === 0) return;

  const doc = new jsPDF();

  tickets.forEach((ticket, index) => {
    if (index > 0) doc.addPage();

    // Header
    doc.setFillColor(26, 86, 219);
    doc.rect(0, 0, 210, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("BRTS Official Ticket", 20, 18);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Bhartiya Railway Ticket System  |  Ticket ${index + 1} of ${tickets.length}`,
      20,
      28,
    );

    // PNR Badge
    doc.setFillColor(249, 115, 22);
    doc.rect(0, 35, 210, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(`PNR: ${ticket.pnr}`, 20, 44);

    // Details
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const lineH = 10;
    let y = 60;
    const col1 = 20;
    const col2 = 90;

    const addRow = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, col1, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, col2, y);
      y += lineH;
    };

    addRow("Passenger:", ticket.passenger.name);
    addRow(
      "Age / Gender:",
      `${ticket.passenger.age} / ${ticket.passenger.gender}`,
    );
    y += 3;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 6;

    addRow("Train:", `${ticket.train.number} - ${ticket.train.name}`);
    addRow("Type:", ticket.train.type);
    addRow("From:", ticket.train.from);
    addRow("To:", ticket.train.to);
    addRow("Duration:", ticket.train.duration);
    y += 3;
    doc.line(20, y, 190, y);
    y += 6;

    addRow("Travel Date:", ticket.travelDate);
    addRow("Class:", ticket.travelClass);
    addRow("Coach:", ticket.coach);
    addRow("Seat No:", ticket.seat.toString());
    y += 3;
    doc.line(20, y, 190, y);
    y += 6;

    // Status
    doc.setFont("helvetica", "bold");
    doc.text("Status:", col1, y);
    if (ticket.status === "CONFIRMED") {
      doc.setTextColor(22, 163, 74);
    } else {
      doc.setTextColor(234, 88, 12);
    }
    doc.text(ticket.status, col2, y);
    doc.setTextColor(30, 30, 30);
    y += lineH + 3;

    doc.line(20, y, 190, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Booked At: ${new Date(ticket.bookedAt).toLocaleString()}`,
      col1,
      y,
    );

    // Footer
    doc.setFillColor(26, 86, 219);
    doc.rect(0, 275, 210, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("BRTS Official Ticket Booking | www.brts.in", 20, 285);
    doc.text(
      `© ${new Date().getFullYear()} Bhartiya Railway Ticket System`,
      20,
      292,
    );
  });

  doc.save(`BRTS_All_Tickets_${new Date().toISOString().split("T")[0]}.pdf`);
}
