
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <Zap className="w-12 h-12 text-white" />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-300 mb-2">Page Not Found</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist in our energy management system.
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = "/"}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
