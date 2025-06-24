
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Battery, Sun, Fuel, Building, ArrowUpDown, ArrowLeftRight } from "lucide-react";
import { useParams } from "react-router-dom";
import SiteTopBar from "./SiteTopBar";

const SiteGrid = () => {
  const { siteId } = useParams();

  // Mock grid components data - this will come from database later
  const gridComponents = {
    solar: { power: 85, status: "active", efficiency: 92 },
    battery: { charge: 78, status: "charging", capacity: 100 },
    generator: { power: 0, status: "standby", fuel: 85 },
    grid: { power: 15, status: "connected", import: true },
    load: { consumption: 95, status: "normal" }
  };

  const energyFlow = {
    solarToBattery: 35,
    solarToLoad: 50,
    batteryToLoad: 10,
    gridToLoad: 15
  };

  const ComponentCard = ({ icon: Icon, title, status, power, unit = "kW", color, details }: any) => (
    <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 text-${color}-400 group-hover:scale-110 transition-transform`} />
            <CardTitle className="text-sm font-medium text-slate-200">{title}</CardTitle>
          </div>
          <Badge className={`${status === 'active' || status === 'connected' || status === 'charging' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'} transition-colors`}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold text-white mb-2">{power} {unit}</div>
        {details && (
          <div className="text-sm text-slate-400 space-y-1">
            {details.map((detail: string, index: number) => (
              <div key={index}>{detail}</div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const EnergyFlow = ({ from, to, value, direction = "horizontal" }: any) => (
    <div className={`flex items-center justify-center ${direction === 'vertical' ? 'flex-col' : 'flex-row'} space-${direction === 'vertical' ? 'y' : 'x'}-2`}>
      <div className={`${direction === 'vertical' ? 'h-8 w-0.5' : 'w-8 h-0.5'} bg-gradient-to-${direction === 'vertical' ? 'b' : 'r'} from-emerald-400 to-green-500 animate-pulse`}></div>
      <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2 py-1 text-xs text-emerald-400 font-medium">
        {value}kW
      </div>
      <div className={`${direction === 'vertical' ? 'h-8 w-0.5' : 'w-8 h-0.5'} bg-gradient-to-${direction === 'vertical' ? 'b' : 'r'} from-emerald-400 to-green-500 animate-pulse`}></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <SiteTopBar />
      
      <div className="p-8 space-y-8">
        {/* Grid Overview */}
        <Card className="bg-slate-900/60 backdrop-blur-sm border-slate-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2 text-xl">
              <Zap className="h-6 w-6 text-emerald-400" />
              <span>Microgrid Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Energy Sources Column */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Energy Sources</h3>
                
                <ComponentCard
                  icon={Sun}
                  title="Solar Panels"
                  status={gridComponents.solar.status}
                  power={gridComponents.solar.power}
                  color="yellow"
                  details={[
                    `Efficiency: ${gridComponents.solar.efficiency}%`,
                    "Peak generation: 12:00 PM"
                  ]}
                />
                
                <EnergyFlow from="solar" to="center" value={energyFlow.solarToBattery + energyFlow.solarToLoad} direction="vertical" />
                
                <ComponentCard
                  icon={Fuel}
                  title="Backup Generator"
                  status={gridComponents.generator.status}
                  power={gridComponents.generator.power}
                  color="orange"
                  details={[
                    `Fuel level: ${gridComponents.generator.fuel}%`,
                    "Auto-start enabled"
                  ]}
                />
              </div>

              {/* Central Hub Column */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Energy Hub</h3>
                
                {/* Energy Balance Display */}
                <Card className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 border-emerald-500/30 shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        {gridComponents.solar.power + gridComponents.generator.power - gridComponents.load.consumption} kW
                      </div>
                      <div className="text-emerald-400 text-sm">Net Energy Balance</div>
                      <div className="mt-4 flex justify-center space-x-4">
                        <div className="text-center">
                          <div className="text-xl font-semibold text-white">{gridComponents.solar.power + gridComponents.generator.power}kW</div>
                          <div className="text-xs text-slate-400">Generation</div>
                        </div>
                        <ArrowLeftRight className="text-slate-500 mt-2" size={16} />
                        <div className="text-center">
                          <div className="text-xl font-semibold text-white">{gridComponents.load.consumption}kW</div>
                          <div className="text-xs text-slate-400">Consumption</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <ComponentCard
                  icon={Battery}
                  title="Battery Storage"
                  status={gridComponents.battery.status}
                  power={gridComponents.battery.charge}
                  unit="%"
                  color="blue"
                  details={[
                    `Capacity: ${gridComponents.battery.capacity}kWh`,
                    "Time to full: 2.5 hours"
                  ]}
                />
              </div>

              {/* Consumption & Grid Column */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Consumption & Grid</h3>
                
                <ComponentCard
                  icon={Building}
                  title="Grid Connection"
                  status={gridComponents.grid.status}
                  power={gridComponents.grid.power}
                  color="purple"
                  details={[
                    `Mode: ${gridComponents.grid.import ? 'Import' : 'Export'}`,
                    "Grid frequency: 50Hz"
                  ]}
                />
                
                <EnergyFlow from="center" to="load" value={energyFlow.batteryToLoad + energyFlow.gridToLoad} direction="vertical" />
                
                <ComponentCard
                  icon={Zap}
                  title="Load Consumption"
                  status={gridComponents.load.status}
                  power={gridComponents.load.consumption}
                  color="cyan"
                  details={[
                    "Critical loads: 65kW",
                    "Non-critical: 30kW"
                  ]}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "System Efficiency", value: "94.2%", change: "+2.1%", color: "emerald" },
            { title: "Carbon Offset", value: "1.2t", change: "+0.3t", color: "green" },
            { title: "Cost Savings", value: "$156", change: "+$23", color: "blue" },
            { title: "Uptime", value: "99.8%", change: "0%", color: "purple" }
          ].map((metric, index) => (
            <Card key={metric.title} className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 hover:bg-slate-700/40 transition-all duration-300 hover:scale-105" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-sm text-slate-400 mb-2">{metric.title}</div>
                  <div className={`text-xs text-${metric.color}-400 font-medium`}>{metric.change} today</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SiteGrid;
