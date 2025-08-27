import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlansProvider } from "@/contexts/PlansContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import Index from "./pages/Index";
import ClientsModern from "./pages/ClientsModern";
import ClientDetailPage from "./pages/ClientDetailPage";
import Prestations from "./pages/Prestations";
import Croissance from "./pages/Croissance";
import Production from "./pages/Production";
import Developpement from "./pages/Developpement";
import Finance from "./pages/Finance";
import FinanceModern from "./pages/FinanceModern";
import FinancialAnalysis from "./pages/FinancialAnalysis";
import RHModern from "./pages/RHModern";
import PlanningModern from "./pages/PlanningModern";
import DataTables from "./pages/DataTables";
import Notifications from "./pages/Notifications";
import AgentIA from "./pages/AgentIA";
import MeetingBuilder from "./pages/MeetingBuilder";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PlansProvider>
      <NotificationsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/clients" element={<ClientsModern />} />
            <Route path="/clients/detail/:id" element={<ClientDetailPage />} />
            <Route path="/prestations" element={<Prestations />} />
            <Route path="/production" element={<Production />} />
            <Route path="/developpement" element={<Developpement />} />
            <Route path="/rh" element={<RHModern />} />
            <Route path="/finance" element={<FinanceModern />} />
            <Route path="/croissance" element={<Croissance />} />
            <Route path="/agent-ia" element={<AgentIA />} />
            <Route path="/meeting-builder" element={<MeetingBuilder />} />
            <Route path="/financial-analysis" element={<FinancialAnalysis />} />
            <Route path="/planning" element={<PlanningModern />} />
            <Route path="/data-tables" element={<DataTables />} />
            <Route path="/notifications" element={<Notifications />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </NotificationsProvider>
  </PlansProvider>
</QueryClientProvider>
);

export default App;
