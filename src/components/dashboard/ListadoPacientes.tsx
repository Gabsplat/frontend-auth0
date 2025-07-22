import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import type { Paciente } from "@/types/Usuarios";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { obtenerPacientes } from "@/utils/pacientes";

export default function ListadoPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getAccessToken } = useAuth();

  const handleFetchPacientes = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("No se pudo obtener el token de autenticación");
        return;
      }

      const pacientes = await obtenerPacientes({ token });
      console.log("Pacientes:", pacientes);
      setPacientes(pacientes);
    } catch (error) {
      console.error("Error fetching pacientes:", error);
      toast.error("Error al cargar los pacientes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchPacientes();
  }, []);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            Gestión de Pacientes
          </h2>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="flex space-x-3">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Gestión de Pacientes
        </h2>
      </div>

      <div className="grid gap-4">
        {pacientes.map((p) => (
          <Card key={p.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12 bg-gray-100 rounded-full text-slate-700">
                    <AvatarFallback className="w-full h-full flex items-center justify-center text-lg font-semibold">
                      {`${p.usuario.nombre?.[0] ?? ""}${
                        p.usuario.apellido?.[0] ?? ""
                      }`.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {p.usuario.nombre} {p.usuario.apellido}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-slate-500">
                        {p.usuario.email}
                      </span>
                      <span className="text-sm text-slate-500">
                        {p.usuario.telefono || "Sin teléfono"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right"></div>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
