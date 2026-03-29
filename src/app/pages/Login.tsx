import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { BarChart3, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      console.log("Login page: Already authenticated, redirecting to dashboard");
      navigate("/", { replace: true });
    }
  }, [isInitialized, isAuthenticated, navigate]);

  // Show loading state while checking auth status
  if (!isInitialized) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Login page: Attempting login for:", email);
      const success = await login(email, password);
      console.log("Login page: Login result:", success);
      
      if (success) {
        toast.success("Login successful!", {
          description: "Welcome back to UXOTI Testing",
        });
        navigate("/");
      } else {
        console.error("Login page: Login failed - no success flag returned");
        setError("Invalid email or password. Please check your credentials and try again.");
      }
    } catch (err) {
      console.error("Login page: Login exception:", err);
      setError(`Login failed: ${err instanceof Error ? err.message : "An error occurred. Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: "var(--background)" }}>
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        {/* Logo/Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-primary mb-3 sm:mb-4">
            <BarChart3 size={28} className="sm:w-8 sm:h-8 text-primary-foreground" />
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-[Crimson_Text]">UXOTI Testing</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            UX Evaluation Platform
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-5 sm:p-6 bg-card border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl">Sign In</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Enter your credentials to access your dashboard
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-destructive">{error}</p>
                  {error.includes("Invalid email or password") && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Need an account? <Link to="/signup" className="text-accent hover:text-accent/80 underline">Sign up here</Link>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm sm:text-base">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm sm:text-base">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-accent hover:text-accent/80 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Demo Credentials */}
        
      </div>
    </div>
  );
}