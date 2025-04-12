import { Bell, Home, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Navigation = () => (
  <nav className="flex justify-center gap-10 items-center h-16 border-t bg-white">
    <NavLink to="/">
      {({ isActive }) => (
        <Home className={`w-10 h-10 ${isActive ? "text-sky-500" : "text-gray-800"}`} />
      )}
    </NavLink>

    <NavLink to="/users">
      {({ isActive }) => (
        <Users className={`w-10 h-10 ${isActive ? "text-sky-500" : "text-gray-800"}`} />
      )}
    </NavLink>

    <NavLink to="/notifications">
      {({ isActive }) => (
        <Bell className={`w-10 h-10 ${isActive ? "text-sky-500" : "text-gray-800"}`} />
      )}
    </NavLink>

    <NavLink to="/profile">
      {({ isActive }) => (
        <Settings className={`w-10 h-10 ${isActive ? "text-sky-500" : "text-gray-800"}`} />
      )}
    </NavLink>
  </nav>
);
