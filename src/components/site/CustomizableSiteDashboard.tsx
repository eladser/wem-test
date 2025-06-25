
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Layout, Save } from 'lucide-react';
import { PowerOutputWidget } from './widgets/PowerOutputWidget';
import { AlertsWidget } from './widgets/AlertsWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Widget {
  id: string;
  type: 'power' | 'alerts' | 'weather' | 'maintenance' | 'analytics';
  title: string;
  span?: 'single' | 'double' | 'full';
}

interface CustomizableSiteDashboardProps {
  siteData: {
    currentOutput: number;
    totalCapacity: number;
    status: string;
  };
}

export const CustomizableSiteDashboard = ({ siteData }: CustomizableSiteDashboardProps) => {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: '1', type: 'power', title: 'Power Output', span: 'double' },
    { id: '2', type: 'alerts', title: 'Recent Alerts', span: 'single' },
    { id: '3', type: 'weather', title: 'Weather', span: 'single' },
  ]);

  const [isCustomizing, setIsCustomizing] = useState(false);

  const addWidget = (type: Widget['type']) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      span: 'single'
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const renderWidget = (widget: Widget) => {
    const baseProps = {
      key: widget.id,
      onRemove: isCustomizing ? () => removeWidget(widget.id) : undefined,
      className: widget.span === 'double' ? 'col-span-2' : widget.span === 'full' ? 'col-span-full' : ''
    };

    switch (widget.type) {
      case 'power':
        return (
          <PowerOutputWidget
            {...baseProps}
            currentOutput={siteData.currentOutput}
            capacity={siteData.totalCapacity}
            trend={5.2}
          />
        );
      case 'alerts':
        return <AlertsWidget {...baseProps} />;
      case 'weather':
        return <WeatherWidget {...baseProps} />;
      default:
        return (
          <div key={widget.id} className={`p-4 bg-slate-800/50 rounded-lg border border-slate-700 ${baseProps.className}`}>
            <h3 className="text-white font-medium">{widget.title}</h3>
            <p className="text-slate-400 text-sm mt-2">Widget content coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Site Dashboard</h2>
          <p className="text-slate-400">Customize your monitoring view</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isCustomizing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Widget
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                <DropdownMenuItem 
                  onClick={() => addWidget('power')}
                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  Power Analytics
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => addWidget('alerts')}
                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  Alerts & Notifications
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => addWidget('weather')}
                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  Weather Conditions
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => addWidget('maintenance')}
                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  Maintenance Schedule
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => addWidget('analytics')}
                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  Performance Analytics
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Button
            variant={isCustomizing ? "default" : "outline"}
            onClick={() => setIsCustomizing(!isCustomizing)}
            className={isCustomizing ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-800 border-slate-600 hover:bg-slate-700"}
          >
            {isCustomizing ? <Save className="w-4 h-4 mr-2" /> : <Layout className="w-4 h-4 mr-2" />}
            {isCustomizing ? 'Save Layout' : 'Customize'}
          </Button>
        </div>
      </div>

      {/* Customization Notice */}
      {isCustomizing && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-400 text-sm">
            <Layout className="w-4 h-4 inline mr-2" />
            Customization mode active. You can add or remove widgets, and drag to reorder them.
          </p>
        </div>
      )}

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map(renderWidget)}
      </div>

      {/* Empty State */}
      {widgets.length === 0 && (
        <div className="text-center py-12">
          <Layout className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No Widgets Added</h3>
          <p className="text-slate-400 mb-6">Start customizing your dashboard by adding widgets</p>
          <Button 
            onClick={() => setIsCustomizing(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Widget
          </Button>
        </div>
      )}
    </div>
  );
};
