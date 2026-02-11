import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from 'react';
import Cookies from 'js-cookie';

// Page Imports
import Test from './pages/al_test';
import Test2 from "./pages/st_test";
import Index from "./pages/Index"; // This is your Landing/Login page
import Alumni from "./pages/Alumni";
import Jobs from "./pages/Jobs";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient();

const App = () => {
  // Check if user is logged in via cookie
  const isAuthenticated = !!Cookies.get('user_session');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* If logged in: "/" shows Dashboard. 
              If NOT logged in: "/" shows Index (Login). 
            */}
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Index />} 
            />

            {/* Protected Dashboard Route: 
              Redirects to "/" (Login) if someone tries to access it without a cookie.
            */}
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} 
            />

            {/* Other Routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/alumni" element={isAuthenticated ? <Alumni /> : <Navigate to="/" />} />
            <Route path="/jobs" element={isAuthenticated ? <Jobs /> : <Navigate to="/" />} />
            <Route path="/events" element={isAuthenticated ? <Events /> : <Navigate to="/" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />
            <Route path="/chat" element={isAuthenticated ? <Chat /> : <Navigate to="/" />} />
            <Route path="/chat/:alumniId" element={isAuthenticated ? <Chat /> : <Navigate to="/" />} />
            <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/" />} />
            
            <Route path="/test" element={<Test />} />
            <Route path="/test2" element={<Test2 />} /> {/* Fixed duplicate /test path */}

            {/* CATCH-ALL ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;