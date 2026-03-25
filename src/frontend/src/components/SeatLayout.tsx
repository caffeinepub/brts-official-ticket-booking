/**
 * SeatLayout – visual coach layout for BRTS seat selection.
 * Shows a typical Indian railway sleeper-style coach:
 *   8 compartments × 6 berths (Lower / Middle / Upper on each side)
 *   + 8 side berths (Side Lower / Side Upper per section)
 * Colors: Available = green | Booked = red | Selected = blue
 */

import { cn } from "@/lib/utils";

export type BerthType =
  | "Lower"
  | "Middle"
  | "Upper"
  | "Side Lower"
  | "Side Upper";

export interface Seat {
  number: number;
  berth: BerthType;
  booked: boolean;
}

interface SeatLayoutProps {
  seats: Seat[];
  selectedSeats: number[];
  onToggleSeat: (seatNumber: number) => void;
}

/** Simple deterministic hash so "booked" seats look realistic for a given train+date. */
export function generateSeats(trainId: string, date: string): Seat[] {
  const seed = [...(trainId + date)].reduce(
    (acc, c) => acc + c.charCodeAt(0),
    0,
  );
  const bookedSet = new Set<number>();
  // Book roughly 30–40% of seats deterministically
  for (let i = 0; i < 24; i++) {
    const n = ((seed * (i + 7) * 31) % 72) + 1;
    bookedSet.add(n);
  }

  const seats: Seat[] = [];
  // 8 compartments × 6 berths each = seats 1–48
  const mainBerths: BerthType[] = [
    "Lower",
    "Middle",
    "Upper",
    "Lower",
    "Middle",
    "Upper",
  ];
  for (let comp = 0; comp < 8; comp++) {
    for (let b = 0; b < 6; b++) {
      const num = comp * 6 + b + 1;
      seats.push({
        number: num,
        berth: mainBerths[b],
        booked: bookedSet.has(num),
      });
    }
  }
  // 8 side berths (Side Lower / Side Upper) = seats 49–56
  const sideBerths: BerthType[] = ["Side Lower", "Side Upper"];
  for (let s = 0; s < 8; s++) {
    const num = 48 + s + 1;
    seats.push({
      number: num,
      berth: sideBerths[s % 2],
      booked: bookedSet.has(num),
    });
  }

  return seats;
}

/** One clickable seat box */
function SeatBox({
  seat,
  selected,
  onToggle,
}: {
  seat: Seat;
  selected: boolean;
  onToggle: () => void;
}) {
  const base =
    "relative flex flex-col items-center justify-center rounded border text-[10px] font-semibold cursor-pointer select-none transition-all w-12 h-12";

  let style = "border-green-400 bg-green-100 text-green-800 hover:bg-green-200";
  if (seat.booked)
    style = "border-red-400 bg-red-100 text-red-700 cursor-not-allowed";
  else if (selected)
    style = "border-blue-600 bg-blue-500 text-white shadow-md scale-105";

  return (
    <button
      type="button"
      onClick={seat.booked ? undefined : onToggle}
      className={cn(base, style)}
      title={`Seat ${seat.number} – ${seat.berth}${seat.booked ? " (Booked)" : selected ? " (Selected)" : " (Available)"}`}
    >
      <span className="text-[11px] font-bold leading-none">{seat.number}</span>
      <span className="leading-none mt-0.5 text-[8px] opacity-80">
        {seat.berth.replace(" ", "\n")}
      </span>
    </button>
  );
}

export default function SeatLayout({
  seats,
  selectedSeats,
  onToggleSeat,
}: SeatLayoutProps) {
  // Split main (1–48) and side (49–56)
  const mainSeats = seats.filter((s) => s.number <= 48);
  const sideSeats = seats.filter((s) => s.number > 48);

  // Group main seats into 8 compartments of 6
  const compartments: Seat[][] = [];
  for (let i = 0; i < 8; i++) {
    compartments.push(mainSeats.slice(i * 6, i * 6 + 6));
  }

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs font-medium">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-green-200 border border-green-400 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-red-200 border border-red-400 inline-block" />
          Booked
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-blue-500 border border-blue-600 inline-block" />
          Selected
        </span>
      </div>

      {/* Coach wrapper */}
      <div
        className="rounded-2xl border-2 border-gray-300 bg-gray-50 overflow-x-auto"
        style={{ borderRadius: "1rem" }}
      >
        {/* Coach header */}
        <div
          className="px-4 py-2 text-xs font-bold text-white flex items-center gap-2"
          style={{ background: "#1a56db", borderRadius: "0.9rem 0.9rem 0 0" }}
        >
          <span>🚆 Coach S1 — Sleeper Class</span>
          <span className="ml-auto opacity-80">Seats: 56</span>
        </div>

        {/* Berth type column labels */}
        <div className="px-4 pt-2 pb-1">
          <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide grid grid-cols-2 mb-1">
            <span>◀ Left Side</span>
            <span className="text-right">Right Side ▶</span>
          </div>

          {/* Compartments */}
          <div className="space-y-3">
            {compartments.map((comp, ci) => {
              const left = comp.slice(0, 3); // Lower, Middle, Upper (left)
              const right = comp.slice(3, 6); // Lower, Middle, Upper (right)
              return (
                <div
                  key={comp[0]?.number ?? ci}
                  className="flex items-center gap-2"
                >
                  <span className="text-[9px] text-muted-foreground w-5 shrink-0 text-center">
                    {ci + 1}
                  </span>
                  {/* Left berths: Upper on top → Lower on bottom (visual stacking) */}
                  <div className="flex gap-1">
                    {[...left].reverse().map((seat) => (
                      <SeatBox
                        key={seat.number}
                        seat={seat}
                        selected={selectedSeats.includes(seat.number)}
                        onToggle={() => onToggleSeat(seat.number)}
                      />
                    ))}
                  </div>
                  {/* Aisle divider */}
                  <div className="flex-1 border-t-2 border-dashed border-gray-300" />
                  {/* Right berths */}
                  <div className="flex gap-1">
                    {[...right].reverse().map((seat) => (
                      <SeatBox
                        key={seat.number}
                        seat={seat}
                        selected={selectedSeats.includes(seat.number)}
                        onToggle={() => onToggleSeat(seat.number)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Side berths */}
          <div className="mt-4 border-t pt-3">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase mb-2">
              Side Berths
            </p>
            <div className="flex flex-wrap gap-2">
              {sideSeats.map((seat) => (
                <SeatBox
                  key={seat.number}
                  seat={seat}
                  selected={selectedSeats.includes(seat.number)}
                  onToggle={() => onToggleSeat(seat.number)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 text-[10px] text-muted-foreground border-t bg-gray-100 rounded-b-2xl">
          Click a green seat to select. Blue = your selection. Red = already
          booked.
        </div>
      </div>
    </div>
  );
}
