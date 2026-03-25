import { jsPDF } from "jspdf";
import type { Booking } from "./storage";

export function downloadTicketPDF(booking: Booking): void {
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
  doc.text(`PNR: ${booking.pnr}`, 20, 44);

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

  addRow("Train:", `${booking.train.number} - ${booking.train.name}`);
  addRow("Type:", booking.train.type);
  addRow("From:", booking.train.from);
  addRow("To:", booking.train.to);
  addRow("Duration:", booking.train.duration);
  addRow("Travel Date:", booking.travelDate);
  addRow("Class:", booking.travelClass);
  addRow("Quota:", booking.quota || "General");
  y += 3;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, 190, y);
  y += 6;

  // Status
  doc.setFont("helvetica", "bold");
  doc.text("Status:", col1, y);
  if (booking.status === "CONFIRMED") {
    doc.setTextColor(22, 163, 74);
  } else {
    doc.setTextColor(234, 88, 12);
  }
  doc.text(booking.status, col2, y);
  doc.setTextColor(30, 30, 30);
  y += lineH + 3;

  doc.line(20, y, 190, y);
  y += 6;

  // Passenger table header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("#", col1, y);
  doc.text("Name", 32, y);
  doc.text("Age", 100, y);
  doc.text("Gender", 120, y);
  doc.text("Coach", 150, y);
  doc.text("Seat", 175, y);
  y += 4;
  doc.line(20, y, 190, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  for (const [i, p] of booking.passengers.entries()) {
    doc.text(String(i + 1), col1, y);
    doc.text(p.name, 32, y);
    doc.text(p.age, 100, y);
    doc.text(p.gender, 120, y);
    doc.text(p.coach, 150, y);
    doc.text(String(p.seat), 175, y);
    y += lineH;
  }

  y += 3;
  doc.line(20, y, 190, y);
  y += 6;

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Booked At: ${new Date(booking.bookedAt).toLocaleString()}`,
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

  doc.save(`BRTS_Ticket_${booking.pnr}.pdf`);
}

export function downloadAllTicketsPDF(bookings: Booking[]): void {
  if (bookings.length === 0) return;

  const doc = new jsPDF();

  bookings.forEach((booking, index) => {
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
      `Bhartiya Railway Ticket System  |  Booking ${index + 1} of ${bookings.length}`,
      20,
      28,
    );

    // PNR Badge
    doc.setFillColor(249, 115, 22);
    doc.rect(0, 35, 210, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(`PNR: ${booking.pnr}`, 20, 44);

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

    addRow("Train:", `${booking.train.number} - ${booking.train.name}`);
    addRow("Type:", booking.train.type);
    addRow("From:", booking.train.from);
    addRow("To:", booking.train.to);
    addRow("Duration:", booking.train.duration);
    addRow("Travel Date:", booking.travelDate);
    addRow("Class:", booking.travelClass);
    addRow("Quota:", booking.quota || "General");
    y += 3;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 6;

    doc.setFont("helvetica", "bold");
    doc.text("Status:", col1, y);
    if (booking.status === "CONFIRMED") {
      doc.setTextColor(22, 163, 74);
    } else {
      doc.setTextColor(234, 88, 12);
    }
    doc.text(booking.status, col2, y);
    doc.setTextColor(30, 30, 30);
    y += lineH + 3;

    doc.line(20, y, 190, y);
    y += 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("#", col1, y);
    doc.text("Name", 32, y);
    doc.text("Age", 100, y);
    doc.text("Gender", 120, y);
    doc.text("Coach", 150, y);
    doc.text("Seat", 175, y);
    y += 4;
    doc.line(20, y, 190, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    for (const [i, p] of booking.passengers.entries()) {
      doc.text(String(i + 1), col1, y);
      doc.text(p.name, 32, y);
      doc.text(p.age, 100, y);
      doc.text(p.gender, 120, y);
      doc.text(p.coach, 150, y);
      doc.text(String(p.seat), 175, y);
      y += lineH;
    }

    y += 3;
    doc.line(20, y, 190, y);
    y += 6;

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Booked At: ${new Date(booking.bookedAt).toLocaleString()}`,
      col1,
      y,
    );

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
