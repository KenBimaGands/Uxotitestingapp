import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // Show loading state while checking for existing session
  if (!isInitialized) {
    console.log("=== PROTECTED ROUTE: Still initializing, showing loading state ===");
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

  // Only redirect to login after initialization is complete
  if (!isAuthenticated) {
    console.log("=== PROTECTED ROUTE: Not authenticated after init, redirecting to login ===");
    return <Navigate to="/login" replace />;
  }

  console.log("=== PROTECTED ROUTE: Authenticated, rendering protected content ===");
  return <>{children}</>;
}