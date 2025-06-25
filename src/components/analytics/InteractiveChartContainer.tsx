
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, Download, Maximize2 } from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface InteractiveChartContainerProps {
  title: string;
  data: ChartData[];
  chartTypes: Array<'line' | 'area' | 'bar' | 'pie'>;
  timeRanges?: string[];
  className?: string;
}

export const InteractiveChartContainer = ({
  title,
  data,
  chartTypes = ['line', 'area', 'bar'],
  timeRanges = ['1h', '24h', '7d', '30d'],
  className = ""
}: InteractiveChartContainerProps) => {
  const [activeChart, setActiveChart] = useState<'line' | 'area' | 'bar' | 'pie'>(chartTypes[0]);
  const [timeRange, setTimeRange] = useState(timeRanges[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const renderChart = () => {
    switch (activeChart) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151', 
                borderRadius: '8px',
                color: '#f9fafb'
              }} 
            />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151', 
                borderRadius: '8px',
                color: '#f9fafb'
              }} 
            />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151', 
                borderRadius: '8px',
                color: '#f9fafb'
              }} 
            />
            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151', 
                borderRadius: '8px',
                color: '#f9fafb'
              }} 
            />
          </PieChart>
        );
      default:
        return null;
    }
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'line': return Activity;
      case 'area': return TrendingUp;
      case 'bar': return BarChart3;
      case 'pie': return PieChartIcon;
      default: return Activity;
    }
  };

  return (
    <Card className={`glass border-slate-700/50 ${className} ${isExpanded ? 'col-span-full' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-white">{title}</CardTitle>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Live
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-20 h-8 glass border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-slate-600">
                {timeRanges.map(range => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-1">
              {chartTypes.map((type) => {
                const IconComponent = getChartIcon(type);
                return (
                  <Button
                    key={type}
                    variant={activeChart === type ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveChart(type)}
                    className={`w-8 h-8 p-0 ${
                      activeChart === type 
                        ? "bg-emerald-600 hover:bg-emerald-700" 
                        : "text-slate-400 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className={`${isExpanded ? 'h-96' : 'h-64'} transition-all duration-300`}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
