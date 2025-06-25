
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockRegions } from "@/services/mockDataService";
import SiteTopBar from "@/components/SiteTopBar";
import { EnhancedSiteHeader } from "@/components/site/EnhancedSiteHeader";
import { CustomizableSiteDashboard } from "@/components/site/CustomizableSiteDashboard";
import SiteGrid from "@/components/SiteGrid";
import SiteAssets from "@/components/SiteAssets";
import SiteReports from "@/components/SiteReports";
import SiteTeam from "@/components/SiteTeam";
import SiteFinances from "@/components/SiteFinances";
import SiteSettings from "@/components/SiteSettings";

const SiteDashboard = () => {
  const { siteId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  
  console.log("Site Dashboard rendering for siteId:", siteId);
  
  if (!siteId) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Site Not Found</h2>
          <p className="text-slate-400">The requested site could not be found.</p>
        </div>
      </div>
    );
  }

  // Find the site
  const site = mockRegions
    .flatMap(region => region.sites)
    .find(site => site.id === siteId);

  if (!site) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Site Not Found</h2>
          <p className="text-slate-400">Site with ID "{siteId}" was not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <SiteTopBar />
      <div className="p-6 space-y-6">
        <EnhancedSiteHeader site={site} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="grid" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30"
            >
              Grid
            </TabsTrigger>
            <TabsTrigger 
              value="assets" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30"
            >
              Assets
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30"
            >
              Reports
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30"
            >
              Team
            </TabsTrigger>
            <TabsTrigger 
              value="finances" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30"
            >
              Finances
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <CustomizableSiteDashboard siteData={site} />
          </TabsContent>

          <TabsContent value="grid" className="space-y-6 mt-6">
            <SiteGrid />
          </TabsContent>

          <TabsContent value="assets" className="space-y-6 mt-6">
            <SiteAssets />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6 mt-6">
            <SiteReports />
          </TabsContent>

          <TabsContent value="team" className="space-y-6 mt-6">
            <SiteTeam />
          </TabsContent>

          <TabsContent value="finances" className="space-y-6 mt-6">
            <SiteFinances />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <SiteSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SiteDashboard;
