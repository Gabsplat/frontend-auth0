import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, Edit } from "lucide-react";
import { updateEspecialidad } from "@/utils/especialidades";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import type { Especialidad } from "@/types/Especialidad";

interface EditarEspecialidadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  especialidad: Especialidad | null;
}

export function EditarEspecialidadModal({
  isOpen,
  onClose,
  onSuccess,
  especialidad,
}: EditarEspecialidadModalProps) {
  const [nombre, setNombre] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessToken } = useAuth();

  // Actualizar el nombre cuando cambie la especialidad
  useEffect(() => {
    if (especialidad) {
      setNombre(especialidad.nombre);
    }
  }, [especialidad]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      toast.error("El nombre de la especialidad es requerido");
      return;
    }

    if (!especialidad) {
      toast.error("No se encontró la especialidad a editar");
      return;
    }

    // Verificar si el nombre cambió
    if (nombre.trim() === especialidad.nombre) {
      toast.info("No se detectaron cambios");
      onClose();
      return;
    }

    setIsLoading(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("No se pudo obtener el token de autenticación");
        return;
      }

      console.log("Actualizando especialidad:", {
        especialidadId: especialidad.id.toString(),
        nombre: nombre.trim(),
      });
      await updateEspecialidad({
        especialidadId: especialidad.id.toString(),
        nombre: nombre.trim(),
        token,
      });

      toast.success("Especialidad actualizada exitosamente");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating especialidad:", error);
      toast.error("Error al actualizar la especialidad");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      // Restaurar el nombre original al cerrar
      if (especialidad) {
        setNombre(especialidad.nombre);
      }
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-blue-600" />
            Editar Especialidad
          </DialogTitle>
          <DialogDescription>
            Modifica el nombre de la especialidad médica.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre de la especialidad</Label>
              <Input
                id="nombre"
                placeholder="Ej: Ortodoncia, Endodoncia..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={isLoading}
                className="focus:ring-blue-500 focus:border-blue-500"
              />
              {especialidad && (
                <p className="text-xs text-gray-500">
                  Nombre actual:{" "}
                  <span className="font-medium">{especialidad.nombre}</span>
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !nombre.trim() ||
                nombre.trim() === especialidad?.nombre
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Actualizar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
