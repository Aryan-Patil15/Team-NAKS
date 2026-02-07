import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import StudentsListPage from "./pages/StudentsListPage";
import AlumniListPage from "./pages/AlumniListPage";
import NotFound from "./pages/NotFound";
import JobApprovalPage from "./pages/JobApprovalPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import St_test from "./pages/st_test";
import Donations from "./pages/Donations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/announcements" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><StudentsListPage /></ProtectedRoute>} />
          <Route path="/alumni" element={<ProtectedRoute><AlumniListPage /></ProtectedRoute>} />
          <Route path="/jobapproval" element={<ProtectedRoute><JobApprovalPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/donation" element={<ProtectedRoute><Donations /></ProtectedRoute>} />
          <Route path="/test" element={<St_test />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
