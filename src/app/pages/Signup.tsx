import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { BarChart3, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function Signup() {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      console.log("Signup page: Already authenticated, redirecting to dashboard");
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

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      console.log("=== SIGNUP ATTEMPT ===");
      console.log("Email:", email);
      console.log("Name:", name);
      console.log("API Base:", API_BASE);
      
      const result = await signup(email, password, name);
      console.log("=== SIGNUP RESULT ===", result);
      
      if (result.success) {
        toast.success("Account created successfully!", {
          description: "Welcome to UXOTI Testing",
        });
        navigate("/");
      } else {
        console.error("=== SIGNUP FAILED ===");
        console.error("Error:", result.error);
        setError(result.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("=== SIGNUP EXCEPTION ===");
      console.error("Exception:", err);
      setError(`Error: ${err instanceof Error ? err.message : "An error occurred. Please check the browser console for details."}`);
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

        {/* Signup Card */}
        <Card className="p-5 sm:p-6 bg-card border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl">Create Account</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Sign up to start evaluating UX projects
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-destructive">{error}</p>
                  {error.includes("already been registered") && (
                    <Link 
                      to="/login" 
                      className="text-sm text-accent hover:text-accent/80 transition-colors underline mt-1 inline-block"
                    >
                      Go to login instead
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm sm:text-base">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                />
              </div>

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
                  placeholder="At least 6 characters"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm sm:text-base">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-accent hover:text-accent/80 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}