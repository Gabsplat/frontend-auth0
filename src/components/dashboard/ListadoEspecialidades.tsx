import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useEffect, useState } from "react";
import type { Especialidad } from "@/types/Especialidad";
import { obtenerEspecialidades } from "@/utils/especialidades";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

import { EditarEspecialidadModal } from "../modals/editar-especialidad";
import { EliminarEspecialidadModal } from "../modals/eliminar-especialidad";
import { CrearEspecialidadModal } from "../modals/crear-especialidad";

export default function ListadoEspecialidades() {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
  const [especialidadToEdit, setEspecialidadToEdit] =
    useState<Especialidad | null>(null);
  const [especialidadToDelete, setEspecialidadToDelete] =
    useState<Especialidad | null>(null);

  const { getAccessToken } = useAuth();

  const handleFetchEspecialidades = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("No se pudo obtener el token de autenticación");
        return;
      }

      const especialidades = await obtenerEspecialidades({ token });
      console.log("Especialidades:", especialidades);
      setEspecialidades(especialidades);
    } catch (error) {
      console.error("Error fetching especialidades:", error);
      toast.error("Error al cargar las especialidades");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (especialidad: Especialidad) => {
    setEspecialidadToEdit(especialidad);
    setIsEditarModalOpen(true);
  };

  const handleDeleteClick = (especialidad: Especialidad) => {
    setEspecialidadToDelete(especialidad);
    setIsEliminarModalOpen(true);
  };

  const handleModalSuccess = () => {
    handleFetchEspecialidades();
  };

  useEffect(() => {
    handleFetchEspecialidades();
  }, []);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            Gestión de Especialidades
          </h2>
          <Button disabled className="bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Especialidad
          </Button>
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
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            Gestión de Especialidades
          </h2>
          <Button
            onClick={() => setIsCrearModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Especialidad
          </Button>
        </div>

        {especialidades.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Plus className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay especialidades registradas
              </h3>
              <p className="text-gray-500 mb-4">
                Comienza agregando tu primera especialidad médica.
              </p>
              <Button
                onClick={() => setIsCrearModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Especialidad
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {especialidades.map((especialidad) => (
              <Card
                key={especialidad.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {especialidad.nombre}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(especialidad)}
                        className="hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(especialidad)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Modales */}
      <CrearEspecialidadModal
        isOpen={isCrearModalOpen}
        onClose={() => setIsCrearModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <EditarEspecialidadModal
        isOpen={isEditarModalOpen}
        onClose={() => {
          setIsEditarModalOpen(false);
          setEspecialidadToEdit(null);
        }}
        onSuccess={handleModalSuccess}
        especialidad={especialidadToEdit}
      />

      <EliminarEspecialidadModal
        isOpen={isEliminarModalOpen}
        onClose={() => {
          setIsEliminarModalOpen(false);
          setEspecialidadToDelete(null);
        }}
        onSuccess={handleModalSuccess}
        especialidad={especialidadToDelete}
      />
    </>
  );
}
