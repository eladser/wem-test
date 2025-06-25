
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { 
  Search, 
  Zap, 
  MapPin, 
  BarChart3, 
  Settings, 
  Grid, 
  Users, 
  FileText, 
  DollarSign,
  Package
} from "lucide-react";
import { mockRegions } from "@/services/mockDataService";

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CommandPalette = ({ open, setOpen }: CommandPaletteProps) => {
  const navigate = useNavigate();

  const mainPages = [
    { title: "Overview", url: "/", icon: BarChart3, description: "Dashboard overview" },
    { title: "Analytics", url: "/analytics", icon: BarChart3, description: "Performance analytics" },
    { title: "Assets", url: "/assets", icon: Package, description: "Asset management" },
    { title: "Settings", url: "/settings", icon: Settings, description: "System settings" },
  ];

  const allSites = mockRegions.flatMap(region => 
    region.sites.map(site => ({
      title: site.name,
      url: `/site/${site.id}`,
      icon: Zap,
      description: `${site.location} - ${site.totalCapacity}MW`,
      region: region.name
    }))
  );

  const allRegions = mockRegions.map(region => ({
    title: region.name,
    url: `/region/${region.id}`,
    icon: MapPin,
    description: `${region.sites.length} sites`,
  }));

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, sites, regions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Main Pages">
          {mainPages.map((page) => (
            <CommandItem
              key={page.url}
              onSelect={() => runCommand(() => navigate(page.url))}
              className="flex items-center gap-3 cursor-pointer"
            >
              <page.icon className="w-4 h-4 text-slate-400" />
              <div className="flex flex-col">
                <span className="text-white">{page.title}</span>
                <span className="text-xs text-slate-400">{page.description}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Regions">
          {allRegions.map((region) => (
            <CommandItem
              key={region.url}
              onSelect={() => runCommand(() => navigate(region.url))}
              className="flex items-center gap-3 cursor-pointer"
            >
              <region.icon className="w-4 h-4 text-violet-400" />
              <div className="flex flex-col">
                <span className="text-white">{region.title}</span>
                <span className="text-xs text-slate-400">{region.description}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Sites">
          {allSites.map((site) => (
            <CommandItem
              key={site.url}
              onSelect={() => runCommand(() => navigate(site.url))}
              className="flex items-center gap-3 cursor-pointer"
            >
              <site.icon className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-white">{site.title}</span>
                <span className="text-xs text-slate-400">{site.description} • {site.region}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
