import { Bell, Home, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Navigation = () => (
    <nav className="flex justify-center gap-10 items-center h-16 border-t bg-white">
      <NavLink to={"home"}>
        <Home className="w-10 h-10 text-sky-500" />
      </NavLink>
      <NavLink to={"home"}>
        <Users className="w-10 h-10 text-gray-800" />
      </NavLink>
  
      <NavLink to={"home"}>
        <Bell className="w-10 h-10 text-gray-800" />
      </NavLink>
  
      <NavLink to={"profile"}>
        <Settings className="w-10 h-10 text-gray-800" />
      </NavLink>
  
    </nav>
  )
  