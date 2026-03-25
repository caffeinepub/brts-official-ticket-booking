/**
 * SeatLayout – visual coach layout for BRTS seat selection.
 * Supports multiple travel classes with different berth layouts.
 * Colors: Available = green | Booked = red | Selected = blue
 */

import { cn } from "@/lib/utils";

export type BerthType =
  | "Lower"
  | "Middle"
  | "Upper"
  | "Side Lower"
  | "Side Upper";

export type TravelClass = "Sleeper" | "AC 3 Tier" | "AC 2 Tier" | "General";

export interface Seat {
  number: number;
  berth: BerthType;
  booked: boolean;
}

interface SeatLayoutProps {
  seats: Seat[];
  selectedSeats: number[];
  onToggleSeat: (seatNumber: number) => void;
  travelClass: TravelClass;
}

/** Simple deterministic hash so "booked" seats look realistic for a given train+date. */
export function generateSeats(
  trainId: string,
  date: string,
  travelClass: TravelClass,
): Seat[] {
  if (travelClass === "General") return [];

  const seed = [...(trainId + date)].reduce(
    (acc, c) => acc + c.charCodeAt(0),
    0,
  );

  const seats: Seat[] = [];

  if (travelClass === "Sleeper") {
    // 8 compartments × 6 berths = 48 seats + 8 side berths = 56 total
    const totalMain = 48;
    const bookedSet = new Set<number>();
    for (let i = 0; i < 24; i++) {
      const n = ((seed * (i + 7) * 31) % 56) + 1;
      bookedSet.add(n);
    }
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
    const sideBerths: BerthType[] = ["Side Lower", "Side Upper"];
    for (let s = 0; s < 8; s++) {
      const num = totalMain + s + 1;
      seats.push({
        number: num,
        berth: sideBerths[s % 2],
        booked: bookedSet.has(num),
      });
    }
  } else if (travelClass === "AC 3 Tier") {
    // 8 compartments × 6 berths (L, M, U each side) = 48 seats, no side berths
    const bookedSet = new Set<number>();
    for (let i = 0; i < 20; i++) {
      const n = ((seed * (i + 7) * 31) % 48) + 1;
      bookedSet.add(n);
    }
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
  } else if (travelClass === "AC 2 Tier") {
    // 8 compartments × 4 berths (L, U each side) = 32 seats, no middle or side berths
    const bookedSet = new Set<number>();
    for (let i = 0; i < 14; i++) {
      const n = ((seed * (i + 7) * 31) % 32) + 1;
      bookedSet.add(n);
    }
    const mainBerths: BerthType[] = ["Lower", "Upper", "Lower", "Upper"];
    for (let comp = 0; comp < 8; comp++) {
      for (let b = 0; b < 4; b++) {
        const num = comp * 4 + b + 1;
        seats.push({
          number: num,
          berth: mainBerths[b],
          booked: bookedSet.has(num),
        });
      }
    }
  }

  return seats;
}

const coachLabels: Record<TravelClass, string> = {
  Sleeper: "Coach S1 — Sleeper Class",
  "AC 3 Tier": "Coach A1 — AC 3 Tier",
  "AC 2 Tier": "Coach B1 — AC 2 Tier",
  General: "General",
};

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
  travelClass,
}: SeatLayoutProps) {
  const isAC2 = travelClass === "AC 2 Tier";
  const berthsPerComp = isAC2 ? 4 : 6;

  // Split main and side seats (Sleeper only has side berths)
  const mainSeats =
    travelClass === "Sleeper" ? seats.filter((s) => s.number <= 48) : seats;
  const sideSeats =
    travelClass === "Sleeper" ? seats.filter((s) => s.number > 48) : [];

  const numCompartments = isAC2 ? 8 : 8;
  const compartments: Seat[][] = [];
  for (let i = 0; i < numCompartments; i++) {
    compartments.push(
      mainSeats.slice(i * berthsPerComp, i * berthsPerComp + berthsPerComp),
    );
  }

  const halfBerths = berthsPerComp / 2;

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
          <span>🚆 {coachLabels[travelClass]}</span>
          <span className="ml-auto opacity-80">Seats: {seats.length}</span>
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
              const left = comp.slice(0, halfBerths);
              const right = comp.slice(halfBerths);
              return (
                <div
                  key={comp[0]?.number ?? ci}
                  className="flex items-center gap-2"
                >
                  <span className="text-[9px] text-muted-foreground w-5 shrink-0 text-center">
                    {ci + 1}
                  </span>
                  {/* Left berths: reversed for visual stacking (Upper on top) */}
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

          {/* Side berths (Sleeper only) */}
          {sideSeats.length > 0 && (
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
          )}
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
