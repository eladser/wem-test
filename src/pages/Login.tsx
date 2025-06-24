
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Lock, Mail, Eye, EyeOff, Leaf, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success("Welcome to EnergyOS! 🌱", {
          description: "Successfully logged into your renewable energy dashboard"
        });
        navigate("/");
      } else {
        setError("Invalid email or password");
        toast.error("Login failed", {
          description: "Please check your credentials and try again"
        });
      }
    } catch (error) {
      setError("An error occurred during login");
      toast.error("Login error", {
        description: "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: "admin@energyos.com", role: "Administrator", permissions: "Full access" },
    { email: "operator@energyos.com", role: "Operator", permissions: "Read, Write, Export" },
    { email: "viewer@energyos.com", role: "Viewer", permissions: "Read only" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-green-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-emerald-400 rounded-full blur-2xl animate-pulse" style={{animationDelay: "2s"}}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23065f46%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="flex gap-8 max-w-6xl w-full">
        {/* Login Card */}
        <Card className="w-full max-w-md bg-slate-900/95 backdrop-blur-xl border-emerald-900/30 shadow-2xl shadow-emerald-950/50 animate-scale-in">
          <CardHeader className="space-y-6 text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-pulse">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                EnergyOS
              </CardTitle>
              <CardDescription className="text-slate-400 text-base">
                Your gateway to sustainable energy management
              </CardDescription>
              <div className="flex items-center justify-center space-x-2 pt-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">Carbon Neutral • Future Ready</span>
              </div>
            </div>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 font-medium">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@energyos.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 bg-slate-800/80 border-emerald-900/30 text-white placeholder-slate-500 focus:border-emerald-400 focus:ring-emerald-400/20 h-12 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 bg-slate-800/80 border-emerald-900/30 text-white placeholder-slate-500 focus:border-emerald-400 focus:ring-emerald-400/20 h-12 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-slate-400">
                  <input type="checkbox" className="rounded border-emerald-900/30 bg-slate-800 text-emerald-500 focus:ring-emerald-400/20" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot password?
                </a>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all duration-200 font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-slate-400">
                  All accounts use password: <span className="text-emerald-400 font-mono">password</span>
                </p>
                <p className="text-xs text-slate-500">
                  Don't have an account? <a href="#" className="text-emerald-400 hover:text-emerald-300">Request access</a>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Demo Accounts Card */}
        <Card className="w-full max-w-md bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Demo Accounts</CardTitle>
            <CardDescription className="text-slate-400">
              Choose an account type to explore different permission levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {demoAccounts.map((account, index) => (
              <div
                key={account.email}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 cursor-pointer hover:border-emerald-500/30 transition-all duration-200 hover:bg-slate-800/70"
                onClick={() => {
                  setEmail(account.email);
                  setPassword("password");
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-emerald-400 font-medium">{account.role}</span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                    Click to use
                  </span>
                </div>
                <div className="text-sm text-slate-300 font-mono mb-1">
                  {account.email}
                </div>
                <div className="text-xs text-slate-500">
                  {account.permissions}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
