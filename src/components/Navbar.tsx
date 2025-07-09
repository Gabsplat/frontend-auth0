import { Smile } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { useState } from "react";
import { useLogin } from "@/auth/useLogin";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const login = useLogin();

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
            <Button
              onClick={login}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Iniciar Sesión
            </Button>
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
