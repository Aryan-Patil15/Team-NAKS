import { MainLayout } from "@/components/layout/MainLayout";
import { GreetingCard } from "@/components/dashboard/GreetingCard";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { OpportunitiesSlider } from "@/components/dashboard/OpportunitiesSlider";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useStudent } from "../hooks/useStudents";
import { Loader2 } from "lucide-react"; // For a polished loading state

export default function Dashboard() {
  // 1. Fetch the student data using your hook
  const { student, loading } = useStudent();

  // 2. Handle the loading state so it doesn't flicker "Alex" or stay blank
  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground animate-pulse">Synchronizing your dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 stagger-children">
        {/* 3. Pass student.name instead of "Alex" */}
        {/* We use student?.name || "User" as a fallback just in case the name field is empty */}
        <GreetingCard userName={student?.name || "User"} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Opportunities - Takes 2 columns */}
          <div className="lg:col-span-6">
            <OpportunitiesSlider />
          </div>
         
        </div>
      </div>
    </MainLayout>
  );
}