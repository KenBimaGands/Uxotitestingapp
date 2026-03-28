import { Link, useLocation } from "react-router";
import { LayoutDashboard, FolderKanban, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/projects", label: "Projects", icon: FolderKanban },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-foreground font-[Crimson_Text]">UXOTI Testing</h1>
        <p className="caption text-sidebar-foreground mt-1 text-[12px]">Evaluate smarter. Report faster.</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-primary/10 hover:text-sidebar-primary"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
            <span>{user ? getInitials(user.name) : "U"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground truncate text-sm">{user?.name || "User Account"}</p>
            <p className="caption text-sidebar-foreground">{user?.role || "Role"}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2"
        >
          <LogOut size={16} />
          Log Out
        </Button>
      </div>
    </aside>
  );
}