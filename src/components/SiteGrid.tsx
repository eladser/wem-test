
import React from "react";
import { useParams } from "react-router-dom";
import SiteTopBar from "./SiteTopBar";
import InteractiveGrid from "./InteractiveGrid";

const SiteGrid = () => {
  const { siteId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <SiteTopBar />
      
      <div className="relative h-[calc(100vh-140px)]">
        <InteractiveGrid />
      </div>
    </div>
  );
};

export default SiteGrid;
