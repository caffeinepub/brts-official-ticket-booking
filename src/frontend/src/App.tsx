import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import SiteLayout from "./components/layout/SiteLayout";
import AdminPanel from "./pages/AdminPanel";
import BookTicket from "./pages/BookTicket";
import CheckTicket from "./pages/CheckTicket";
import Home from "./pages/Home";
import Trains from "./pages/Trains";

const rootRoute = createRootRoute({ component: SiteLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const trainsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trains",
  component: Trains,
});
const bookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book",
  component: BookTicket,
});
const checkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/check",
  component: CheckTicket,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPanel,
});
// Catch-all: redirect any unknown path to home
const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$",
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: Home,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  trainsRoute,
  bookRoute,
  checkRoute,
  adminRoute,
  catchAllRoute,
]);

const router = createRouter({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}
