import { Heart, Train } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer style={{ background: "#1e3a8a" }} className="text-white">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Train className="h-5 w-5" style={{ color: "#f97316" }} />
            <span className="font-bold">BRTS Official Ticket Booking</span>
          </div>
          <div className="text-center text-sm text-blue-200">
            © {year} BRTS Official Ticket Booking. All rights reserved.
          </div>
          <p className="text-xs text-blue-300 flex items-center gap-1">
            Built with <Heart className="h-3 w-3 fill-red-400 text-red-400" />{" "}
            using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-100 hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
