import TicketCard from "@/components/TicketCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Ticket, getTickets } from "@/utils/storage";
import { AlertCircle, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function CheckTicket() {
  const [pnr, setPnr] = useState("");
  const [result, setResult] = useState<Ticket | "not_found" | null>(null);
  const [searched, setSearched] = useState("");

  const handleSearch = () => {
    const query = pnr.trim();
    if (!query) return;
    const tickets = getTickets();
    const found = tickets.find((t) => t.pnr === query);
    setSearched(query);
    setResult(found ?? "not_found");
  };

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-1">Check Ticket</h1>
      <p className="text-muted-foreground mb-8">
        Enter your PNR number to view full booking details
      </p>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Label className="mb-1.5 block">PNR Number</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter 10-digit PNR number"
              value={pnr}
              onChange={(e) => {
                // Allow only digits
                const val = e.target.value.replace(/\D/g, "");
                setPnr(val);
                // Clear previous result when user edits
                if (result !== null) setResult(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              inputMode="numeric"
              maxLength={10}
              data-ocid="check.pnr_input"
            />
            <Button
              onClick={handleSearch}
              disabled={!pnr.trim()}
              style={{ background: "#1a56db" }}
              className="text-white shrink-0"
              data-ocid="check.search_button"
            >
              <Search className="h-4 w-4 mr-1" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {result === "not_found" && (
          <motion.div
            key="not_found"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 rounded-xl text-red-700"
              data-ocid="check.error_state"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Ticket Not Found</p>
                <p className="text-sm">
                  No ticket found for PNR <strong>{searched}</strong>. Make sure
                  you copy the exact PNR shown on your ticket and try again.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {result && result !== "not_found" && (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <TicketCard ticket={result} index={0} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
