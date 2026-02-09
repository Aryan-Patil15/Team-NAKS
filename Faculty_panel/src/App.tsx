import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import AlumniDirectory from "@/pages/AlumniDirectory";
import Announcements from "@/pages/Announcements";
import Events from "@/pages/Events";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

// --- AUTH HELPERS ---

// 1. Check if the "facultyId" cookie exists
const checkAuth = () => {
  return document.cookie.split(';').some((item) => item.trim().startsWith('facultyId='));
};

// 2. Component to protect routes (Dashboard, etc.)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = checkAuth();
  
  if (!isAuthenticated) {
    // If not logged in, redirect to Login page
    return <Navigate to="/" replace />;
  }
  return children;
};

// 3. Component for public routes (Login)
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = checkAuth();

  if (isAuthenticated) {
    // If already logged in, redirect to Dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// --- APP COMPONENT ---

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Route: Only accessible if NOT logged in */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />

          {/* Protected Layout: All child routes require the cookie */}
          <Route 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alumni" element={<AlumniDirectory />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/events" element={<Events />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;