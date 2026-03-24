import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Ticket, deleteTicket, getTickets } from "@/utils/storage";
import { downloadAllTicketsPDF, downloadTicketPDF } from "@/utils/ticketPdf";
import {
  AlertCircle,
  Download,
  FileDown,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const ADMIN_USER = "Gamester4443";
const ADMIN_PASS = "BRTS3341";

export default function AdminPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [denied, setDenied] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pnrSearch, setPnrSearch] = useState("");

  // Stable refresh function
  const refreshTickets = useCallback(() => {
    setTickets(getTickets());
  }, []);

  // Load tickets on mount if already logged in, and whenever loggedIn changes
  useEffect(() => {
    if (loggedIn) {
      refreshTickets();
    }
  }, [loggedIn, refreshTickets]);

  // Auto-refresh when localStorage changes (cross-tab or same-tab via storage event)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "brts_tickets" && loggedIn) {
        refreshTickets();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [loggedIn, refreshTickets]);

  // Auto-refresh when the user returns to this tab/page
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && loggedIn) {
        refreshTickets();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [loggedIn, refreshTickets]);

  const handleLogin = () => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setLoggedIn(true);
      setDenied(false);
    } else {
      setDenied(true);
    }
  };

  const handleRefresh = () => {
    refreshTickets();
    setPnrSearch("");
  };

  const handleDelete = (pnr: string) => {
    deleteTicket(pnr);
    refreshTickets();
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setDenied(false);
    setPnrSearch("");
  };

  // Filter tickets by PNR substring (digits only search)
  const filteredTickets = pnrSearch
    ? tickets.filter((t) =>
        t.pnr.toLowerCase().includes(pnrSearch.toLowerCase()),
      )
    : tickets;

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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-7 w-7" style={{ color: "#1a56db" }} />
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground text-sm">
              {tickets.length} booking{tickets.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tickets.length > 0 && (
            <Button
              onClick={() => downloadAllTicketsPDF(tickets)}
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
            className="flex items-center gap-1"
            data-ocid="admin.refresh_button"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
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
      {tickets.length > 0 && (
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9 pr-9"
              placeholder="Enter PNR number"
              value={pnrSearch}
              inputMode="numeric"
              onChange={(e) => {
                // Only allow digits
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
              {filteredTickets.length}
            </span>{" "}
            of <span className="font-semibold">{tickets.length}</span> booking
            {tickets.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {tickets.length === 0 ? (
        <div
          className="py-20 text-center text-muted-foreground"
          data-ocid="admin.empty_state"
        >
          No tickets booked yet.
        </div>
      ) : filteredTickets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-20 text-center"
          data-ocid="admin.error_state"
        >
          <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground font-medium">
            No tickets match this PNR
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
                  <TableHead>PNR</TableHead>
                  <TableHead>Passenger</TableHead>
                  <TableHead>Train</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Coach/Seat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket, i) => (
                  <TableRow key={ticket.pnr} data-ocid={`admin.row.${i + 1}`}>
                    <TableCell className="font-mono text-xs font-bold">
                      {/* Highlight matching digits */}
                      {pnrSearch ? (
                        <HighlightMatch text={ticket.pnr} query={pnrSearch} />
                      ) : (
                        ticket.pnr
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{ticket.passenger.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {ticket.passenger.age}yr · {ticket.passenger.gender}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">
                        {ticket.train.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {ticket.train.number}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {ticket.train.from} → {ticket.train.to}
                    </TableCell>
                    <TableCell className="text-sm">
                      {ticket.travelDate}
                    </TableCell>
                    <TableCell className="text-sm">
                      {ticket.travelClass}
                    </TableCell>
                    <TableCell className="text-sm">
                      {ticket.coach} / {ticket.seat}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="text-xs"
                        style={
                          ticket.status === "CONFIRMED"
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
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => downloadTicketPDF(ticket)}
                          title="Download PDF"
                          data-ocid={`admin.download_button.${i + 1}`}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(ticket.pnr)}
                          title="Delete"
                          data-ocid={`admin.delete_button.${i + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Highlight matching substring in PNR
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
