import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
           <p className="text-muted-foreground mt-2">Manage your stories and access resources.</p>
        </div>
        <Button onClick={() => navigate("/generate-story")}>
          <Plus className="mr-2 h-4 w-4" /> New Story
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for Dashboard Stats/Content */}
        <div className="col-span-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground bg-muted/20">
            Select "New Story" to start crafting content or explore Resources.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
