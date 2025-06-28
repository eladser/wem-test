import React from "react";
import { useParams } from "react-router-dom";
import InteractiveGrid from "./InteractiveGrid";

const SiteGrid = () => {
  const { siteId } = useParams();

  return (
    <div className="w-full space-y-6">
      {/* Grid Content - No duplicate header */}
      <div className="relative h-[calc(100vh-200px)] rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900/50">
        <InteractiveGrid />
      </div>
    </div>
  );
};

export default SiteGrid;
