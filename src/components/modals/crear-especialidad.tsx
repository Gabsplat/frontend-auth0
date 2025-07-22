import type React from "react";

import { useState } from "react";
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
import { Loader2, Plus } from "lucide-react";
import { crearEspecialidad } from "@/utils/especialidades";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface CrearEspecialidadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CrearEspecialidadModal({
  isOpen,
  onClose,
  onSuccess,
}: CrearEspecialidadModalProps) {
  const [nombre, setNombre] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      toast.error("El nombre de la especialidad es requerido");
      return;
    }

    setIsLoading(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("No se pudo obtener el token de autenticación");
        return;
      }

      await crearEspecialidad({ nombre: nombre.trim(), token });

      toast.success("Especialidad creada exitosamente");
      setNombre("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating especialidad:", error);
      toast.error("Error al crear la especialidad");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setNombre("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Nueva Especialidad
          </DialogTitle>
          <DialogDescription>
            Ingresa el nombre de la nueva especialidad médica.
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
              disabled={isLoading || !nombre.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Especialidad
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
