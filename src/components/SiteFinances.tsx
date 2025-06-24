
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Receipt, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useParams } from "react-router-dom";
import SiteTopBar from "./SiteTopBar";

const SiteFinances = () => {
  const { siteId } = useParams();

  const revenueData = [
    { month: "Jan", revenue: 12500, expenses: 8200, profit: 4300 },
    { month: "Feb", revenue: 14200, expenses: 8800, profit: 5400 },
    { month: "Mar", revenue: 13800, expenses: 9100, profit: 4700 },
    { month: "Apr", revenue: 15600, expenses: 9500, profit: 6100 },
    { month: "May", revenue: 16800, expenses: 9800, profit: 7000 },
    { month: "Jun", revenue: 18200, expenses: 10200, profit: 8000 }
  ];

  const expenseBreakdown = [
    { name: "Maintenance", value: 35, color: "#10b981" },
    { name: "Operations", value: 28, color: "#3b82f6" },
    { name: "Insurance", value: 20, color: "#f59e0b" },
    { name: "Other", value: 17, color: "#8b5cf6" }
  ];

  const transactions = [
    { id: 1, date: "2024-01-15", description: "Energy Sales - Grid", amount: 2500, type: "income" },
    { id: 2, date: "2024-01-14", description: "Maintenance - Inverter #1", amount: -450, type: "expense" },
    { id: 3, date: "2024-01-13", description: "Energy Sales - Direct", amount: 1800, type: "income" },
    { id: 4, date: "2024-01-12", description: "Insurance Premium", amount: -1200, type: "expense" },
    { id: 5, date: "2024-01-10", description: "Carbon Credits Sale", amount: 3200, type: "income" }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteTopBar />
      
      <div className="p-6 space-y-6">
        {/* Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-900/50 border-emerald-900/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$18,200</div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <p className="text-xs text-emerald-400">+8.3% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-emerald-900/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Monthly Expenses</CardTitle>
              <Receipt className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$10,200</div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-red-400" />
                <p className="text-xs text-red-400">+4.1% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-emerald-900/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Net Profit</CardTitle>
              <PiggyBank className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$8,000</div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <p className="text-xs text-emerald-400">+14.3% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-emerald-900/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">78.4%</div>
              <p className="text-xs text-emerald-400">Annual return</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-emerald-900/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-white">Revenue vs Expenses</CardTitle>
              <CardDescription className="text-slate-400">Monthly financial performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }} 
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} />
                  <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-emerald-900/20 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="text-white">Expense Breakdown</CardTitle>
              <CardDescription className="text-slate-400">Cost distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-slate-900/50 border-emerald-900/20 animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-emerald-400" />
              <span>Recent Transactions</span>
            </CardTitle>
            <CardDescription className="text-slate-400">Latest financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-emerald-900/20 hover:bg-slate-700/50 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      transaction.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-slate-400 text-sm">{transaction.date}</p>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteFinances;
