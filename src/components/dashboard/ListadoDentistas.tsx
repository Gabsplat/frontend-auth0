import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

import type { Dentista } from "@/types/Usuarios";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { obtenerDentistas } from "@/utils/dentistas";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

export default function ListadoDentistas() {
  const [dentistas, setDentistas] = useState<Dentista[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
  const [dentistaToDelete, setDentistaToDelete] = useState<Dentista | null>(
    null
  );

  const { getAccessToken } = useAuth();

  const handleFetchDentistas = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("No se pudo obtener el token de autenticación");
        return;
      }

      const dentistas = await obtenerDentistas({ token });
      console.log("Dentistas:", dentistas);
      setDentistas(dentistas);
    } catch (error) {
      console.error("Error fetching dentistas:", error);
      toast.error("Error al cargar los dentistas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchDentistas();
  }, []);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            Gestión de Dentistas
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
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            Gestión de Dentistas
          </h2>
        </div>

        <div className="grid gap-4">
          {dentistas.map((dentist) => (
            <Card
              key={dentist.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12 bg-gray-100 rounded-full text-slate-700">
                      <AvatarFallback className="w-full h-full flex items-center justify-center text-lg font-semibold">
                        {`${dentist.usuario.nombre?.[0] ?? ""}${
                          dentist.usuario.apellido?.[0] ?? ""
                        }`.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {dentist.usuario.nombre} {dentist.usuario.apellido}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {dentist.especialidad.nombre}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-slate-500">
                          {dentist.usuario.email}
                        </span>
                        <span className="text-sm text-slate-500">
                          {dentist.usuario.telefono || "Sin teléfono"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button> */}
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
    </>
  );
}
