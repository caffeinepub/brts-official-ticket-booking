import TicketCard from "@/components/TicketCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@/hooks/useActor";
import { type Ticket, searchTicketByPnrAndName } from "@/utils/storage";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function CheckTicket() {
  const { actor } = useActor();
  const [pnr, setPnr] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState<Ticket | "not_found" | null>(null);
  const [searched, setSearched] = useState("");
  const [searching, setSearching] = useState(false);

  const canSearch =
    pnr.trim().length > 0 && name.trim().length > 0 && !!actor && !searching;

  const handleSearch = async () => {
    if (!canSearch || !actor) return;
    const pnrQuery = pnr.trim();
    setSearching(true);
    try {
      const found = await searchTicketByPnrAndName(actor, pnrQuery, name);
      setSearched(pnrQuery);
      setResult(found ?? "not_found");
    } catch (e) {
      console.error("Search failed:", e);
      setSearched(pnrQuery);
      setResult("not_found");
    } finally {
      setSearching(false);
    }
  };

  const clearResult = () => setResult(null);

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-1">Check Ticket</h1>
      <p className="text-muted-foreground mb-8">
        Enter your PNR number and passenger name to view booking details
      </p>

      <Card className="mb-6">
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label className="mb-1.5 block">PNR Number</Label>
            <Input
              placeholder="Enter 10-digit PNR number"
              value={pnr}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setPnr(val);
                clearResult();
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              inputMode="numeric"
              maxLength={10}
              data-ocid="check.pnr_input"
            />
          </div>

          <div>
            <Label className="mb-1.5 block">Passenger Name</Label>
            <Input
              placeholder="Enter name exactly as booked"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearResult();
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              data-ocid="check.name_input"
            />
          </div>

          <Button
            onClick={handleSearch}
            disabled={!canSearch}
            style={{ background: "#1a56db" }}
            className="w-full text-white"
            data-ocid="check.search_button"
          >
            {searching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" /> Search Ticket
              </>
            )}
          </Button>
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
                  No ticket found for PNR <strong>{searched}</strong> with the
                  provided name. Please check your details and try again.
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
