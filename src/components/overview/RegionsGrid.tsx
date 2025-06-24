
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { RegionCard } from "./RegionCard";

interface Site {
  id: string;
  name: string;
  status: string;
  totalCapacity: number;
  currentOutput: number;
}

interface Region {
  id: string;
  name: string;
  sites: Site[];
}

interface RegionsGridProps {
  regions: Region[];
}

export const RegionsGrid: React.FC<RegionsGridProps> = ({ regions }) => {
  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 animate-slide-in-up">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          Regional Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((region, index) => (
            <RegionCard key={region.id} region={region} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
