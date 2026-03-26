import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { Booking } from "./storage";

const LOGO_PATH =
  "/assets/uploads/img_20260312_202124-019d2490-f395-70d3-8de8-3f1d44358f73-1.png";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

function createContainer(): HTMLDivElement {
  const div = document.createElement("div");
  div.style.cssText =
    "position:absolute;left:-9999px;top:0;z-index:-1;background:#fff;";
  document.body.appendChild(div);
  return div;
}

// ─── Single Ticket PDF ───────────────────────────────────────────────────────

export async function downloadTicketPDF(booking: Booking): Promise<void> {
  const isGeneral = booking.travelClass === "General";

  const passengerRows = booking.passengers
    .map(
      (p, i) => `
    <tr style="background:${i % 2 === 0 ? "#fff" : "#f0f4ff"}">
      <td style="padding:7px 10px;color:#888;font-size:12px">${i + 1}</td>
      <td style="padding:7px 10px;font-weight:700;color:#0a2c6e;font-size:13px">${p.name}</td>
      <td style="padding:7px 10px;color:#555;font-size:12px">${p.age}</td>
      <td style="padding:7px 10px;color:#555;font-size:12px">${p.gender}</td>
      <td style="padding:7px 10px;font-family:monospace;font-weight:700;color:#333;font-size:12px">${isGeneral ? "GN" : p.coach}</td>
      <td style="padding:7px 10px;font-family:monospace;font-weight:700;color:#333;font-size:12px">${isGeneral ? "Not Applicable" : p.seat}</td>
      <td style="padding:7px 10px;color:#666;font-size:11px">${isGeneral ? "General \u2013 No Seat" : (p as any).berth || "-"}</td>
    </tr>`,
    )
    .join("");

  const container = createContainer();
  container.innerHTML = `
  <div id="brts-single-ticket" style="width:794px;background:#fff;font-family:'Segoe UI',Arial,sans-serif;border:1px solid #c8d8f0;border-radius:8px;overflow:hidden">

    <!-- Header -->
    <div style="background:#0a2c6e;padding:16px 20px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="color:#aac4ff;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">Bhartiya Railway Ticket System</div>
        <div style="color:#fff;font-size:22px;font-weight:800;letter-spacing:1px">BRTS Official e-Ticket</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <img src="${LOGO_PATH}" style="height:48px;object-fit:contain" crossorigin="anonymous" />
        <div style="color:#aac4ff;font-size:10px">Booked: ${new Date(booking.bookedAt).toLocaleDateString("en-IN")}</div>
      </div>
    </div>

    <!-- PNR bar -->
    <div style="background:#f0f4ff;border-bottom:2px solid #c8d8f0;padding:10px 20px;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:20px">
        <div>
          <div style="font-size:9px;color:#888;letter-spacing:2px;text-transform:uppercase">PNR Number</div>
          <div style="font-family:monospace;font-size:24px;font-weight:900;color:#0a2c6e;letter-spacing:4px">${booking.pnr}</div>
        </div>
        <div style="height:36px;width:1px;background:#c8d8f0"></div>
        <div style="background:${booking.status === "CONFIRMED" ? "#dcfce7" : "#fff3e0"};color:${booking.status === "CONFIRMED" ? "#166534" : "#9a3412"};border:1.5px solid ${booking.status === "CONFIRMED" ? "#86efac" : "#fdba74"};padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px">${booking.status}</div>
      </div>
      <div style="text-align:right;font-size:11px;color:#555">
        <div>Class: <strong style="color:#0a2c6e">${classLabel(booking.travelClass)}</strong></div>
        <div style="margin-top:3px">Quota: <strong style="color:#0a2c6e">${quotaLabel(booking.quota || "General")}</strong></div>
      </div>
    </div>

    <!-- Train + Journey -->
    <div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #e0eaff">
      <div style="padding:14px 20px;background:#f8faff;border-right:1px solid #e0eaff">
        <div style="font-size:9px;color:#aaa;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px">Train Information</div>
        <div style="font-size:16px;font-weight:800;color:#0a2c6e">${booking.train.name}</div>
        <div style="font-size:12px;font-family:monospace;color:#444;margin-top:2px">${booking.train.number}</div>
        <div style="font-size:11px;color:#888;margin-top:4px">${booking.train.type} &bull; ${booking.train.duration}</div>
      </div>
      <div style="padding:14px 20px">
        <div style="font-size:9px;color:#aaa;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px">Journey Details</div>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="text-align:center">
            <div style="font-size:16px;font-weight:800;color:#0a2c6e">${booking.train.from}</div>
            <div style="font-size:9px;color:#aaa;letter-spacing:1px">ORIGIN</div>
          </div>
          <div style="flex:1;border-top:2px dashed #90aad8;position:relative">
            <div style="position:absolute;top:-9px;left:50%;transform:translateX(-50%);color:#0a2c6e;font-size:14px">&rarr;</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:16px;font-weight:800;color:#0a2c6e">${booking.train.to}</div>
            <div style="font-size:9px;color:#aaa;letter-spacing:1px">DESTINATION</div>
          </div>
        </div>
        <div style="margin-top:8px;font-size:11px;color:#666">Travel Date: <strong style="color:#333">${booking.travelDate}</strong></div>
      </div>
    </div>

    <!-- Passenger table -->
    <div style="padding:14px 20px;border-bottom:1px solid #e0eaff">
      <div style="font-size:9px;color:#aaa;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Passenger Details</div>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#0a2c6e">
            <th style="text-align:left;padding:8px 10px;color:#fff;font-size:11px">#</th>
            <th style="text-align:left;padding:8px 10px;color:#fff;font-size:11px">Passenger Name</th>
            <th style="text-align:left;padding:8px 10px;color:#fff;font-size:11px">Age</th>
            <th style="text-align:left;padding:8px 10px;color:#fff;font-size:11px">Gender</th>
            <th style="text-align:left;padding:8px 10px;color:#fff;font-size:11px">Coach</th>
            <th style="text-align:left;padding:8px 10px;color:#fff;font-size:11px">Seat No.</th>
            <th style="text-align:left;padding:8px 10px;color:#fff;font-size:11px">Berth</th>
          </tr>
        </thead>
        <tbody>${passengerRows}</tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#f0f4ff;border-top:1px solid #c8d8f0;padding:10px 20px;text-align:center">
      <p style="font-size:11px;color:#888;font-style:italic;margin:0">This is a computer-generated ticket. No signature required.</p>
    </div>

  </div>
  `;

  const root = container.querySelector<HTMLElement>("#brts-single-ticket")!;
  await delay(300);

  const canvas = await html2canvas(root, {
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

  document.body.removeChild(container);
}

// ─── All Tickets PDF ─────────────────────────────────────────────────────────

export async function downloadAllTicketsPDF(
  bookings: Booking[],
): Promise<void> {
  if (bookings.length === 0) return;

  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const waiting = bookings.length - confirmed;

  const rows = bookings
    .map(
      (b, i) => `
    <tr style="background:${i % 2 === 0 ? "#f8faff" : "#eef2ff"}">
      <td style="padding:6px 7px;font-family:monospace;font-weight:700;color:#0a2c6e;font-size:11px;white-space:nowrap">${b.pnr}</td>
      <td style="padding:6px 7px;font-size:11px;color:#222">${b.passengers[0]?.name ?? "-"}${b.passengers.length > 1 ? ` <span style="color:#888;font-size:10px">+${b.passengers.length - 1}</span>` : ""}</td>
      <td style="padding:6px 7px;font-size:11px;color:#333">${b.train.number} ${b.train.name}</td>
      <td style="padding:6px 7px;font-size:11px;color:#333;white-space:nowrap">${b.train.from} \u2192 ${b.train.to}</td>
      <td style="padding:6px 7px;font-size:11px;color:#333;white-space:nowrap">${b.travelDate}</td>
      <td style="padding:6px 7px;font-size:11px;color:#333">${classLabel(b.travelClass)}</td>
      <td style="padding:6px 7px;font-size:11px;color:#333">${quotaLabel(b.quota || "General")}</td>
      <td style="padding:6px 7px;font-family:monospace;font-size:11px;color:#333">${b.passengers[0]?.coach ?? "-"}</td>
      <td style="padding:6px 7px;font-family:monospace;font-size:11px;color:#333">${b.travelClass === "General" ? "N/A" : (b.passengers[0]?.seat ?? "-")}</td>
      <td style="padding:6px 7px"><span style="background:${b.status === "CONFIRMED" ? "#dcfce7" : "#fff3e0"};color:${b.status === "CONFIRMED" ? "#166534" : "#9a3412"};border:1px solid ${b.status === "CONFIRMED" ? "#86efac" : "#fdba74"};padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700">${b.status}</span></td>
    </tr>`,
    )
    .join("");

  const container = createContainer();
  container.innerHTML = `
  <div id="brts-all-tickets" style="width:1050px;background:#fff;font-family:'Segoe UI',Arial,sans-serif">

    <!-- Header -->
    <div style="background:#0a2c6e;padding:16px 20px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="color:#aac4ff;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">Admin Report</div>
        <div style="color:#fff;font-size:18px;font-weight:800">BRTS Official Ticket Booking — All Tickets Report</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
        <img src="${LOGO_PATH}" style="height:44px;object-fit:contain" crossorigin="anonymous" />
        <div style="color:#aac4ff;font-size:10px">Generated: ${new Date().toLocaleString("en-IN")}</div>
      </div>
    </div>

    <!-- Summary -->
    <div style="background:#eef2ff;border-bottom:2px solid #c8d8f0;padding:10px 20px;display:flex;gap:40px;align-items:center">
      <div style="font-size:13px;color:#0a2c6e;font-weight:700">Total Tickets: <span style="font-size:18px">${bookings.length}</span></div>
      <div style="font-size:13px;color:#166534;font-weight:700">&#10003; Confirmed: <span style="font-size:18px">${confirmed}</span></div>
      <div style="font-size:13px;color:#9a3412;font-weight:700">&#9679; Waiting List: <span style="font-size:18px">${waiting}</span></div>
    </div>

    <!-- Table -->
    <div style="padding:16px 20px">
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#0a2c6e">
            ${["PNR", "Name", "Train", "Route", "Date", "Class", "Quota", "Coach", "Seat", "Status"].map((h) => `<th style="text-align:left;padding:8px 7px;color:#fff;font-size:11px;font-weight:700">${h}</th>`).join("")}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#0a2c6e;padding:10px 20px;text-align:center">
      <p style="font-size:11px;color:#aac4ff;font-style:italic;margin:0">This is a computer-generated report. BRTS Official Ticket Booking — Bhartiya Railway Ticket System</p>
    </div>

  </div>
  `;

  const root = container.querySelector<HTMLElement>("#brts-all-tickets")!;
  await delay(300);

  const canvas = await html2canvas(root, {
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

  const dateStr = new Date().toISOString().split("T")[0];
  doc.save(`BRTS_All_Tickets_${dateStr}.pdf`);

  document.body.removeChild(container);
}
