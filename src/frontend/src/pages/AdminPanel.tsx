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
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const ADMIN_USER = "Gamester4443";
const ADMIN_PASS = "BRTS3341";

export default function AdminPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [denied, setDenied] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const handleLogin = () => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setLoggedIn(true);
      setDenied(false);
      setTickets(getTickets());
    } else {
      setDenied(true);
    }
  };

  const handleDelete = (pnr: string) => {
    deleteTicket(pnr);
    setTickets(getTickets());
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setDenied(false);
  };

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
            onClick={handleLogout}
            className="flex items-center gap-1"
            data-ocid="admin.logout_button"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div
          className="py-20 text-center text-muted-foreground"
          data-ocid="admin.empty_state"
        >
          No tickets booked yet.
        </div>
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
                {tickets.map((ticket, i) => (
                  <TableRow key={ticket.pnr} data-ocid={`admin.row.${i + 1}`}>
                    <TableCell className="font-mono text-xs font-bold">
                      {ticket.pnr}
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
