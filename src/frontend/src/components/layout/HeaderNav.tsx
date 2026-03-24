import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Trains", path: "/trains" },
  { label: "Book Ticket", path: "/book" },
  { label: "Check Ticket", path: "/check" },
  { label: "Admin", path: "/admin" },
];

export default function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ background: "#1a56db" }}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2"
          data-ocid="nav.home_link"
        >
          <img
            src="/assets/uploads/img_20260312_202124-019d1f50-677a-7697-ad9b-e89b3c8ecd4d-1.png"
            alt="BRTS Official Logo"
            style={{
              height: 52,
              width: "auto",
              objectFit: "contain",
              padding: "4px 0",
            }}
          />
          {/* Website name next to logo */}
          <span
            className="font-bold text-white leading-tight hidden sm:block"
            style={{ fontSize: "0.95rem", maxWidth: 160, lineHeight: 1.2 }}
          >
            BRTS Official
            <br />
            Ticket Booking
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentPath === item.path
                  ? "text-white"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}
              style={
                currentPath === item.path
                  ? { background: "rgba(255,255,255,0.2)" }
                  : {}
              }
              data-ocid={`nav.${item.label.toLowerCase().replace(" ", "_")}_link`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[260px]">
            <div className="flex items-center gap-2 mb-6">
              <img
                src="/assets/uploads/img_20260312_202124-019d1f50-677a-7697-ad9b-e89b3c8ecd4d-1.png"
                alt="BRTS Official Logo"
                style={{ height: 44, width: "auto", objectFit: "contain" }}
              />
              <span
                className="font-bold text-foreground leading-tight"
                style={{ fontSize: "0.9rem", lineHeight: 1.2 }}
              >
                BRTS Official
                <br />
                Ticket Booking
              </span>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    currentPath === item.path
                      ? "text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                  style={
                    currentPath === item.path ? { background: "#1a56db" } : {}
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
