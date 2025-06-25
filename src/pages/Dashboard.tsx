
import React from "react";
import { EnhancedDashboardLayout } from "@/components/dashboard/EnhancedDashboardLayout";

const Dashboard = () => {
  console.log("Dashboard component rendering");
  
  return (
    <div className="p-6">
      <EnhancedDashboardLayout />
    </div>
  );
};

export default Dashboard;
