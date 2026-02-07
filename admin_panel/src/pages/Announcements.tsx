import { useState } from "react";
import BroadcastTool from "@/components/content/BroadcastTool";
import BroadcastViewer from "@/components/content/BroadcastViewer";

export default function Announcements() {
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          EVENTS
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create and manage events for your network
        </p>

        {/* Tabs */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 text-sm rounded-md transition-all ${
              activeTab === "create"
                ? "bg-blue-600 text-white"
                : "bg-muted/40 text-muted-foreground hover:bg-muted"
            }`}
          >
            Create Event
          </button>

          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-2 text-sm rounded-md transition-all ${
              activeTab === "manage"
                ? "bg-blue-600 text-white"
                : "bg-muted/40 text-muted-foreground hover:bg-muted"
            }`}
          >
            Manage Events
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "create" && (
        <div
          className="max-w-2xl mx-auto animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          <BroadcastTool />
        </div>
      )}

      {activeTab === "manage" && (
        <div
          className="max-w-3xl mx-auto animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          <BroadcastViewer />
        </div>
      )}
    </div>
  );
}
