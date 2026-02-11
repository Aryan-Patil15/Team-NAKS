import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Chat from "./pages/Chat";
import Home from "./pages/Index";
import Profile from "./pages/Profile";
import Networking from "./pages/Networking";
import Jobs from "./pages/Jobs";
import Events from "./pages/Events";
import Alumini from "./pages/Alumini";
import Settings from "./pages/Settings";
import Jobs_opp from "./pages/Jobs_opp";
import LoginPage from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/networking" element={<Networking />} />
          <Route path="/alumini" element={<Alumini />} />
          
          {/* FIX: Added dynamic parameter :alumniId */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:requestId" element={<Chat />} />
          
          <Route path="/mentorship" element={<Jobs_opp />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}