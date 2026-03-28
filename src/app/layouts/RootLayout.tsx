import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { ProtectedRoute } from "../components/ProtectedRoute";

export function RootLayout() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
}