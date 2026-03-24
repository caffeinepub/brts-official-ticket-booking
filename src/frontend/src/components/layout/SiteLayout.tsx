import { Outlet } from "@tanstack/react-router";
import AnnouncementBar from "./AnnouncementBar";
import Footer from "./Footer";
import HeaderNav from "./HeaderNav";

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <HeaderNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
