import { type TravelClass, classLabel } from "@/components/SeatLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@/hooks/useActor";
import {
  type Booking,
  deleteBooking,
  getTickets,
  groupTicketsIntoBookings,
} from "@/utils/storage";
import { downloadAllTicketsPDF, downloadTicketPDF } from "@/utils/ticketPdf";
import {
  AlertCircle,
  Download,
  Eye,
  FileDown,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const ADMIN_USER = "Gamester4443";
const ADMIN_PASS = "BRTS3341";

function quotaLabel(q: string): string {
  if (q === "Tatkal") return "TQ - Tatkal";
  if (q === "Ladies") return "LD - Ladies";
  return "GN - General";
}

export default function AdminPanel() {
  const { actor } = useActor();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [denied, setDenied] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pnrSearch, setPnrSearch] = useState("");
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshTickets = useCallback(async () => {
    if (!actor) return;
    setLoadingTickets(true);
    try {
      const fetched = await getTickets(actor);
      setBookings(groupTicketsIntoBookings(fetched));
    } catch (e) {
      console.error("Failed to fetch tickets:", e);
    } finally {
      setLoadingTickets(false);
    }
  }, [actor]);

  useEffect(() => {
    if (!loggedIn || !actor) return;
    refreshTickets();
    intervalRef.current = setInterval(refreshTickets, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loggedIn, actor, refreshTickets]);

  const handleLogin = () => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setLoggedIn(true);
      setDenied(false);
    } else {
      setDenied(true);
    }
  };

  const handleRefresh = () => {
    setPnrSearch("");
    refreshTickets();
  };

  const handleDelete = async (pnr: string) => {
    if (!actor) return;
    try {
      await deleteBooking(actor, pnr);
      await refreshTickets();
    } catch (e) {
      console.error("Failed to delete booking:", e);
    }
  };

  const handleLogout = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setDenied(false);
    setPnrSearch("");
    setBookings([]);
  };

  const filteredBookings = pnrSearch
    ? bookings.filter((b) =>
        b.pnr.toLowerCase().includes(pnrSearch.toLowerCase()),
      )
    : bookings;

  if (!loggedIn) {
    return (
      <div className="container py-10 max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <ShieldCheck className="h-7 w-7" style={{ color: "#1a56db" }} />
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground text-sm">
              Authorized access only
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Username</Label>
              <Input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                data-ocid="admin.username_input"
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                data-ocid="admin.password_input"
              />
            </div>

            <AnimatePresence>
              {denied && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg p-3"
                  data-ocid="admin.error_state"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-semibold">Access Denied</span>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              onClick={handleLogin}
              className="w-full text-white"
              style={{ background: "#1a56db" }}
              data-ocid="admin.submit_button"
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-7 w-7" style={{ color: "#1a56db" }} />
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground text-sm">
              {loadingTickets
                ? "Loading..."
                : `${bookings.length} booking${
                    bookings.length !== 1 ? "s" : ""
                  } found`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {bookings.length > 0 && (
            <Button
              onClick={() => downloadAllTicketsPDF(bookings)}
              className="flex items-center gap-1.5 text-white"
              style={{ background: "#f97316" }}
              data-ocid="admin.download_all_button"
            >
              <FileDown className="h-4 w-4" />
              Download All PDFs
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loadingTickets}
            className="flex items-center gap-1"
            data-ocid="admin.refresh_button"
          >
            <RefreshCw
              className={`h-4 w-4 ${loadingTickets ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-1"
            data-ocid="admin.logout_button"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      {/* PNR Search Bar */}
      {bookings.length > 0 && (
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9 pr-9"
              placeholder="Enter PNR number"
              value={pnrSearch}
              inputMode="numeric"
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setPnrSearch(val);
              }}
              aria-label="Search by PNR"
              data-ocid="admin.search_input"
            />
            <AnimatePresence>
              {pnrSearch && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  type="button"
                  onClick={() => setPnrSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                  data-ocid="admin.close_button"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Showing{" "}
            <span className="font-semibold" style={{ color: "#1a56db" }}>
              {filteredBookings.length}
            </span>{" "}
            of <span className="font-semibold">{bookings.length}</span> booking
            {bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Table / States */}
      {loadingTickets && bookings.length === 0 ? (
        <div className="space-y-3" data-ocid="admin.loading_state">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div
          className="py-20 text-center text-muted-foreground"
          data-ocid="admin.empty_state"
        >
          No bookings yet.
        </div>
      ) : filteredBookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-20 text-center"
          data-ocid="admin.error_state"
        >
          <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground font-medium">
            No bookings match this PNR
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Try a different number or clear the search
          </p>
        </motion.div>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table data-ocid="admin.table">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[130px]">PNR</TableHead>
                  <TableHead className="min-w-[160px]">Passengers</TableHead>
                  <TableHead className="min-w-[160px]">Train</TableHead>
                  <TableHead className="min-w-[160px]">Route</TableHead>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="w-[110px]">Class</TableHead>
                  <TableHead className="w-[110px]">Quota</TableHead>
                  <TableHead className="w-[100px]">Coach/Seat</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[180px] text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking, i) => (
                  <TableRow key={booking.pnr} data-ocid={`admin.row.${i + 1}`}>
                    <TableCell className="font-mono text-xs font-bold">
                      {pnrSearch ? (
                        <HighlightMatch text={booking.pnr} query={pnrSearch} />
                      ) : (
                        booking.pnr
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-semibold text-muted-foreground mb-0.5">
                        {booking.passengers.length} passenger
                        {booking.passengers.length !== 1 ? "s" : ""}
                      </div>
                      {booking.passengers.map((p) => (
                        <div
                          key={`${p.name}-${p.seat}`}
                          className="leading-tight"
                        >
                          <span className="font-medium text-sm">{p.name}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            {p.age}yr · {p.gender}
                          </span>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">
                        {booking.train.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {booking.train.number}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {booking.train.from} → {booking.train.to}
                    </TableCell>
                    <TableCell className="text-sm">
                      {booking.travelDate}
                    </TableCell>
                    <TableCell className="text-sm">
                      {classLabel(booking.travelClass as TravelClass)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {quotaLabel(booking.quota || "General")}
                    </TableCell>
                    <TableCell className="text-sm">
                      {booking.passengers
                        .map((p) => `${p.coach}/${p.seat}`)
                        .join(", ")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs gap-1 border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                          onClick={() => setViewBooking(booking)}
                          data-ocid={`admin.open_modal_button.${i + 1}`}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>

                        {/* PDF */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs gap-1 border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                          onClick={() => downloadTicketPDF(booking)}
                          data-ocid={`admin.download_button.${i + 1}`}
                        >
                          <Download className="h-3 w-3" />
                          PDF
                        </Button>

                        {/* Delete with confirm */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs gap-1 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
                              data-ocid={`admin.delete_button.${i + 1}`}
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent data-ocid="admin.dialog">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Booking?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete booking{" "}
                                <span className="font-mono font-bold">
                                  {booking.pnr}
                                </span>{" "}
                                for{" "}
                                {booking.passengers
                                  .map((p) => p.name)
                                  .join(", ")}
                                . This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel data-ocid="admin.cancel_button">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(booking.pnr)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                data-ocid="admin.confirm_button"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* View Ticket Modal */}
      <Dialog
        open={viewBooking !== null}
        onOpenChange={(open) => !open && setViewBooking(null)}
      >
        <DialogContent className="max-w-2xl" data-ocid="admin.modal">
          {viewBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-lg">Booking Details</span>
                  <StatusBadge status={viewBooking.status} />
                </DialogTitle>
              </DialogHeader>

              {/* PNR prominent */}
              <div
                className="rounded-lg px-4 py-3 flex items-center justify-between"
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                }}
              >
                <div>
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                    PNR Number
                  </p>
                  <p
                    className="font-mono text-2xl font-bold"
                    style={{ color: "#1a56db" }}
                  >
                    {viewBooking.pnr}
                  </p>
                </div>
                {viewBooking.bookedAt && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Booked At</p>
                    <p className="text-sm text-muted-foreground">
                      {viewBooking.bookedAt}
                    </p>
                  </div>
                )}
              </div>

              {/* Train & Journey info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Train</p>
                  <p className="font-semibold text-sm">
                    {viewBooking.train.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {viewBooking.train.number}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Route</p>
                  <p className="font-semibold text-sm">
                    {viewBooking.train.from} → {viewBooking.train.to}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Travel Date
                  </p>
                  <p className="font-semibold text-sm">
                    {viewBooking.travelDate}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Class</p>
                  <p className="font-semibold text-sm">
                    {classLabel(viewBooking.travelClass as TravelClass)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Quota</p>
                  <p className="font-semibold text-sm">
                    {quotaLabel(viewBooking.quota || "General")}
                  </p>
                </div>
              </div>

              {/* Passengers table */}
              <div>
                <p className="text-sm font-semibold mb-2">
                  Passengers ({viewBooking.passengers.length})
                </p>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">#</TableHead>
                        <TableHead className="text-xs">Name</TableHead>
                        <TableHead className="text-xs">Age</TableHead>
                        <TableHead className="text-xs">Gender</TableHead>
                        <TableHead className="text-xs">Coach</TableHead>
                        <TableHead className="text-xs">Seat</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewBooking.passengers.map((p, idx) => (
                        <TableRow key={`${p.name}-${p.seat}`}>
                          <TableCell className="text-xs text-muted-foreground">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-medium text-sm">
                            {p.name}
                          </TableCell>
                          <TableCell className="text-sm">{p.age}</TableCell>
                          <TableCell className="text-sm">{p.gender}</TableCell>
                          <TableCell className="text-sm font-mono">
                            {p.coach}
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {p.seat}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <DialogFooter className="flex gap-2 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={() => setViewBooking(null)}
                  data-ocid="admin.close_button"
                >
                  Close
                </Button>
                <Button
                  onClick={() => downloadTicketPDF(viewBooking)}
                  className="text-white gap-1.5"
                  style={{ background: "#f97316" }}
                  data-ocid="admin.download_button"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      className="text-xs"
      style={
        status === "CONFIRMED"
          ? {
              background: "#dcfce7",
              color: "#166534",
              border: "1px solid #bbf7d0",
            }
          : {
              background: "#fff7ed",
              color: "#9a3412",
              border: "1px solid #fed7aa",
            }
      }
    >
      {status}
    </Badge>
  );
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark
        style={{
          background: "#fef08a",
          color: "#854d0e",
          borderRadius: "2px",
          padding: "0 1px",
        }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
