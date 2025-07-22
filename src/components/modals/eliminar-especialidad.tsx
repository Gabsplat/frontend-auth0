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
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { eliminarEspecialidad } from "@/utils/especialidades";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import type { Especialidad } from "@/types/Especialidad";

interface EliminarEspecialidadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  especialidad: Especialidad | null;
}

export function EliminarEspecialidadModal({
  isOpen,
  onClose,
  onSuccess,
  especialidad,
}: EliminarEspecialidadModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessToken } = useAuth();

  const handleDelete = async () => {
    if (!especialidad) return;

    setIsLoading(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("No se pudo obtener el token de autenticación");
        return;
      }

      await eliminarEspecialidad({
        especialidadId: especialidad.id.toString(),
        token,
      });

      toast.success("Especialidad eliminada exitosamente");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting especialidad:", error);
      toast.error("Error al eliminar la especialidad");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Eliminar Especialidad
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la
            especialidad.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              ¿Estás seguro de que deseas eliminar la especialidad{" "}
              <span className="font-semibold">"{especialidad?.nombre}"</span>?
            </p>
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
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
