import type { Booking } from "./storage";

const LOGO_PATH =
  "/assets/uploads/img_20260312_202124-019d2490-f395-70d3-8de8-3f1d44358f73-1.png";

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
    `Class:${booking.travelClass} Quota:${quotaLabel(booking.quota || "General")}`,
    `Status:${booking.status}`,
    `Passengers:${passengers}`,
  ].join(" | ");
}

function ensureJsPDFLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).jspdf) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

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

async function getLogoDataURL(): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve("");
    img.src = LOGO_PATH;
  });
}

async function getQRDataURL(booking: Booking): Promise<string> {
  await ensureQRLoaded();
  return new Promise((resolve) => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);
    const QRCode = (window as any).QRCode;
    new QRCode(container, {
      text: buildQRData(booking),
      width: 120,
      height: 120,
      colorDark: "#0a2c6e",
      colorLight: "#ffffff",
    });
    setTimeout(() => {
      const canvas = container.querySelector("canvas");
      const url = canvas ? canvas.toDataURL("image/png") : "";
      document.body.removeChild(container);
      resolve(url);
    }, 200);
  });
}

async function renderTicketPage(
  doc: any,
  booking: Booking,
  qrCanvas: HTMLCanvasElement | null,
  barcodeCanvas: HTMLCanvasElement | null,
  logoDataURL: string,
): Promise<void> {
  const W = 210;
  const BLUE = [10, 44, 110] as [number, number, number];
  const LIGHT_BLUE = [240, 244, 255] as [number, number, number];
  const ORANGE = [234, 88, 12] as [number, number, number];
  const GREEN = [22, 163, 74] as [number, number, number];
  const WHITE = [255, 255, 255] as [number, number, number];
  const GRAY = [100, 100, 100] as [number, number, number];

  // Header bar
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, W, 28, "F");

  // Logo in header (top-right)
  if (logoDataURL) {
    try {
      doc.addImage(logoDataURL, "PNG", W - 36, 1, 22, 22);
    } catch (_) {
      // ignore logo errors
    }
  }

  doc.setTextColor(...WHITE);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("BHARTIYA RAILWAY TICKET SYSTEM", 14, 9);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("BRTS Official e-Ticket", 14, 20);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Booked: ${new Date(booking.bookedAt).toLocaleDateString("en-IN")}`,
    W - 40,
    27,
    { align: "right" },
  );

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
  const isConfirmed = booking.status === "CONFIRMED";
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...(isConfirmed ? GREEN : ORANGE));
  doc.text(booking.status, W - 14, 33, { align: "right" });
  doc.setTextColor(...GRAY);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Class: ${booking.travelClass}  |  Quota: ${quotaLabel(booking.quota || "General")}`,
    W - 14,
    40,
    { align: "right" },
  );

  let y = 48;
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
  doc.text("->", W / 2 + W / 4, y + 12, { align: "center" });
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  doc.text(`Travel Date: ${booking.travelDate}`, W / 2 + 6, y + 18);

  y += 22;
  doc.setDrawColor(200, 210, 240);
  doc.setLineWidth(0.3);
  doc.line(0, y, W, y);
  y += 4;

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text("PASSENGER DETAILS", 14, y);
  y += 4;

  const colX = [14, 22, 80, 100, 122, 148, 172];
  const headers = [
    "#",
    "Passenger Name",
    "Age",
    "Gender",
    "Coach",
    "Seat No.",
    "Berth",
  ];

  doc.setFillColor(...BLUE);
  doc.rect(14, y, W - 28, 7, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  headers.forEach((h: string, i: number) => doc.text(h, colX[i], y + 5));
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

  const qrDataURL = qrCanvas
    ? qrCanvas.toDataURL("image/png")
    : await getQRDataURL(booking);
  if (qrDataURL) {
    doc.addImage(qrDataURL, "PNG", 14, y, 30, 30);
  }
  doc.setFontSize(6);
  doc.setTextColor(...GRAY);
  doc.setFont("helvetica", "normal");
  doc.text("Scan QR for details", 29, y + 33, { align: "center" });

  if (barcodeCanvas) {
    const barcodeDataURL = barcodeCanvas.toDataURL("image/png");
    doc.addImage(barcodeDataURL, "PNG", 50, y + 4, 70, 18);
  }
  doc.setFontSize(6);
  doc.setTextColor(...GRAY);
  doc.text(booking.pnr, 85, y + 27, { align: "center" });

  // Logo watermark / stamp at bottom-right of ticket body
  if (logoDataURL) {
    try {
      doc.addImage(logoDataURL, "PNG", W - 44, y, 28, 28);
    } catch (_) {
      // ignore
    }
  }

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
  barcodeCanvas?: HTMLCanvasElement | null,
): Promise<void> {
  await ensureJsPDFLoaded();
  const logoDataURL = await getLogoDataURL();
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF();
  await renderTicketPage(
    doc,
    booking,
    qrCanvas ?? null,
    barcodeCanvas ?? null,
    logoDataURL,
  );
  doc.save(`BRTS_Ticket_${booking.pnr}.pdf`);
}

// -- All Tickets Report (compact table layout) ---------------------------------
export async function downloadAllTicketsPDF(
  bookings: Booking[],
): Promise<void> {
  if (bookings.length === 0) return;
  await ensureJsPDFLoaded();
  const logoDataURL = await getLogoDataURL();
  const { jsPDF } = (window as any).jspdf;

  // A4 landscape gives more horizontal space for columns
  const doc = new jsPDF({ orientation: "landscape" });
  const PW = 297; // page width  (mm)
  const PH = 210; // page height (mm)
  const ML = 8; // left margin
  const MR = 8; // right margin

  const BLUE = [10, 44, 110] as [number, number, number];
  const LIGHT_BLUE = [230, 238, 255] as [number, number, number];
  const ORANGE = [220, 80, 10] as [number, number, number];
  const GREEN = [22, 163, 74] as [number, number, number];
  const WHITE = [255, 255, 255] as [number, number, number];
  const _GRAY = [110, 110, 110] as [number, number, number];
  const DARK = [30, 30, 30] as [number, number, number];

  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const waiting = bookings.length - confirmed;

  // -- Page header ------------------------------------------------------------
  const drawPageHeader = (pageLabel?: string) => {
    doc.setFillColor(...BLUE);
    doc.rect(0, 0, PW, 22, "F");

    if (logoDataURL) {
      try {
        doc.addImage(logoDataURL, "PNG", ML, 2, 16, 16);
      } catch (_) {}
    }

    doc.setTextColor(...WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(
      `BRTS Official Ticket Booking -- All Tickets Report${
        pageLabel ? ` (${pageLabel})` : ""
      }`,
      PW / 2,
      10,
      { align: "center" },
    );
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, PW / 2, 18, {
      align: "center",
    });
  };

  drawPageHeader();

  // -- Summary box ------------------------------------------------------------
  let y = 26;
  doc.setFillColor(...LIGHT_BLUE);
  doc.roundedRect(ML, y, PW - ML - MR, 13, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  const cx = PW / 2;
  doc.setTextColor(...BLUE);
  doc.text(`Total Tickets: ${bookings.length}`, cx - 55, y + 8.5, {
    align: "center",
  });
  doc.setTextColor(...GREEN);
  doc.text(`Confirmed: ${confirmed}`, cx, y + 8.5, { align: "center" });
  doc.setTextColor(...ORANGE);
  doc.text(`Waiting List: ${waiting}`, cx + 55, y + 8.5, { align: "center" });

  y += 16;

  // -- Column layout ----------------------------------------------------------
  // [label, x-start, col-width]
  // Landscape A4 = 297mm, margins 8mm each side = 281mm usable
  const cols: [string, number, number][] = [
    ["PNR", ML, 25],
    ["Passenger", ML + 25, 36],
    ["Train", ML + 61, 42],
    ["Route", ML + 103, 38],
    ["Date", ML + 141, 20],
    ["Class", ML + 161, 14],
    ["Quota", ML + 175, 22],
    ["Coach", ML + 197, 14],
    ["Seat", ML + 211, 12],
    ["Status", ML + 223, 22],
  ];

  const ROW_H = 6.5;
  const HDR_H = 8;
  const FOOTER_H = 9;
  const USABLE_H = PH - FOOTER_H;

  const drawTableHeader = (startY: number): number => {
    doc.setFillColor(...BLUE);
    doc.rect(ML, startY, PW - ML - MR, HDR_H, "F");
    doc.setTextColor(...WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    for (const [label, x] of cols) doc.text(label, x + 2, startY + 5.5);
    return startY + HDR_H;
  };

  y = drawTableHeader(y);

  // -- Rows -------------------------------------------------------------------
  let pageNum = 1;

  bookings.forEach((booking, idx) => {
    // Auto page-break
    if (y + ROW_H > USABLE_H - FOOTER_H) {
      // Footer on current page
      doc.setFillColor(...BLUE);
      doc.rect(0, PH - FOOTER_H, PW, FOOTER_H, "F");
      doc.setFont("helvetica", "italic");
      doc.setFontSize(6);
      doc.setTextColor(...WHITE);
      doc.text(
        "This is a computer-generated report. BRTS Official Ticket Booking -- Bhartiya Railway Ticket System",
        PW / 2,
        PH - FOOTER_H + 5.5,
        { align: "center" },
      );

      doc.addPage();
      pageNum++;
      drawPageHeader(`Page ${pageNum}`);
      y = 26;
      y = drawTableHeader(y);
    }

    // Alternating row background
    doc.setFillColor(
      idx % 2 === 0 ? 248 : 238,
      idx % 2 === 0 ? 250 : 244,
      idx % 2 === 0 ? 255 : 255,
    );
    doc.rect(ML, y, PW - ML - MR, ROW_H, "F");

    // Row divider
    doc.setDrawColor(210, 220, 240);
    doc.setLineWidth(0.1);
    doc.line(ML, y + ROW_H, PW - MR, y + ROW_H);

    doc.setFontSize(6);

    // PNR
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BLUE);
    doc.text(booking.pnr, cols[0][1] + 2, y + 4.5);

    // Passenger (first + count)
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    const firstName = booking.passengers[0]?.name ?? "-";
    const moreLabel =
      booking.passengers.length > 1 ? ` +${booking.passengers.length - 1}` : "";
    const paxLabel = doc.splitTextToSize(
      firstName + moreLabel,
      cols[1][2] - 3,
    )[0] as string;
    doc.text(paxLabel, cols[1][1] + 2, y + 4.5);

    // Train
    const trainLabel = doc.splitTextToSize(
      `${booking.train.number} ${booking.train.name}`,
      cols[2][2] - 3,
    )[0] as string;
    doc.text(trainLabel, cols[2][1] + 2, y + 4.5);

    // Route — use " -> " instead of unicode arrow (jsPDF helvetica font doesn't support \u2192)
    doc.text(
      `${booking.train.from} -> ${booking.train.to}`,
      cols[3][1] + 2,
      y + 4.5,
    );

    // Date
    doc.text(booking.travelDate ?? "-", cols[4][1] + 2, y + 4.5);

    // Class
    doc.text(booking.travelClass ?? "-", cols[5][1] + 2, y + 4.5);

    // Quota
    const qLabel = doc.splitTextToSize(
      quotaLabel(booking.quota || "General"),
      cols[6][2] - 3,
    )[0] as string;
    doc.text(qLabel, cols[6][1] + 2, y + 4.5);

    // Coach
    doc.text(booking.passengers[0]?.coach ?? "-", cols[7][1] + 2, y + 4.5);

    // Seat
    const seatVal = booking.passengers[0]?.seat;
    const seatTxt = seatVal != null && seatVal !== 0 ? String(seatVal) : "-";
    doc.text(seatTxt, cols[8][1] + 2, y + 4.5);

    // Status
    const isConf = booking.status === "CONFIRMED";
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...(isConf ? GREEN : ORANGE));
    doc.text(booking.status, cols[9][1] + 2, y + 4.5);

    y += ROW_H;
  });

  // -- Footer (last page) -----------------------------------------------------
  doc.setFillColor(...BLUE);
  doc.rect(0, PH - FOOTER_H, PW, FOOTER_H, "F");
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6);
  doc.setTextColor(...WHITE);
  doc.text(
    "This is a computer-generated report. BRTS Official Ticket Booking -- Bhartiya Railway Ticket System",
    PW / 2,
    PH - FOOTER_H + 5.5,
    { align: "center" },
  );

  doc.save(
    `BRTS_All_Tickets_Report_${new Date().toISOString().split("T")[0]}.pdf`,
  );
}
