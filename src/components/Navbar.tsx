import {
  Smile,
  User,
  LogOut,
  Settings,
  Shield,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, backendUser, userRole, login, logout } = useAuth();

  console.log("Navbar userRole:", userRole);
  console.log("Navbar backendUser:", backendUser);
  const getRoleBadge = (role: string | null) => {
    const roleColors = {
      paciente: "bg-blue-500 ",
      dentista: "bg-green-500",
      administrador: "bg-purple-500",
    };
    return roleColors[role as keyof typeof roleColors] || "bg-gray-500";
  };

  const getRoleIcon = (role: string | null) => {
    const roleIcons = {
      paciente: User,
      dentista: Stethoscope,
      administrador: Shield,
    };
    const IconComponent = roleIcons[role as keyof typeof roleIcons] || User;
    return <IconComponent className="w-4 h-4 text-white" />;
  };

  const getRoleLabel = (role: string | null) => {
    const roleLabels = {
      paciente: "Paciente",
      dentista: "Dentista",
      administrador: "Administrador",
    };
    return roleLabels[role as keyof typeof roleLabels] || "Usuario";
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Smile className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                DentalCare Pro
              </h1>
              <p className="text-xs text-slate-500">
                Tu sonrisa, nuestra pasión
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="#especialidades"
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Especialidades
            </Link>
            <Link
              to="#reseñas"
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Reseñas
            </Link>
            <Link
              to="#contacto"
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Contacto
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-blue-50 transition-colors"
                  >
                    <div
                      className={`w-9 h-9 ${getRoleBadge(
                        userRole
                      )} rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow`}
                    >
                      {getRoleIcon(userRole)}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {backendUser?.email || "Usuario"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {getRoleLabel(userRole)}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/dashboard${userRole ? `/${userRole}` : ""}`}
                      className="flex items-center cursor-pointer"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={login}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Iniciar Sesión
              </Button>
            )}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-slate-600"></div>
              <div className="w-full h-0.5 bg-slate-600"></div>
              <div className="w-full h-0.5 bg-slate-600"></div>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
