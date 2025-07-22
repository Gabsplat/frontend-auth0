import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Play,
  Save,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react";

import { toast } from "sonner";
import { actualizarConsulta, iniciarConsulta } from "@/utils/turnos";
import { useAuth } from "@/context/AuthContext";
import type { ConsultaMedica, Turno } from "@/types/Turno";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  appointment: Turno | null;
}

type ConsultationStatus = "PROGRAMADO" | "EN_CURSO" | "TERMINADO" | "TERMINADO";

export function ConsultationModal({
  isOpen,
  onClose,
  onSuccess,
  appointment,
}: ConsultationModalProps) {
  const [token, setToken] = useState<string | null>(null);
  const [consultationStatus, setConsultationStatus] =
    useState<ConsultationStatus>("PROGRAMADO");
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    notasTratamiento: "",
    comentarios: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { getAccessToken } = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      const t = await getAccessToken();
      setToken(t);
    };
    fetchToken();
  }, [getAccessToken]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.notasTratamiento.trim()) {
      newErrors.notasTratamiento = "Las notas del tratamiento son requeridas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartConsultation = async () => {
    const res = await iniciarConsulta({
      turnoId: appointment!.id,
      token,
    });
    console.log("Consulta iniciada:", res);
    if (!res) {
      toast.error("Error al iniciar la consulta");

      return;
    }
    setConsultationStatus("EN_CURSO");
    setStartTime(new Date());
    toast.success("Consulta iniciada");
  };

  const handleCompleteConsultation = async () => {
    if (!validateForm()) return;
    const res = await actualizarConsulta({
      turnoId: appointment!.id,
      data: {
        estado: "TERMINADO",
        notasTratamiento: formData.notasTratamiento.trim(),
        comentarios: formData.comentarios.trim() || "",
      },
      token,
    });

    console.log("Consulta actualizada:", res);
    if (!res) {
      toast.error("Error al completar la consulta");
      return;
    }
    toast.success("Consulta completada exitosamente");
    setConsultationStatus("TERMINADO");
  };

  const handleFinishConsultation = async () => {
    if (!validateForm() || !appointment) return;

    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("No se pudo obtener el token de autenticación");
        return;
      }

      const updateData: ConsultaMedica = {
        estado: "TERMINADO" as const,
        notasTratamiento: formData.notasTratamiento.trim(),
        comentarios: formData.comentarios.trim() || "",
      };

      await actualizarConsulta({
        turnoId: appointment.id,
        data: updateData,
        token,
      });

      setConsultationStatus("TERMINADO");
      toast.success("Consulta finalizada exitosamente");

      // Esperar un momento para mostrar el estado TERMINADO
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Error finishing consultation:", error);
      toast.error("Error al finalizar la consulta");
      setConsultationStatus("EN_CURSO");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (consultationStatus === "EN_CURSO") {
      if (
        confirm(
          "¿Estás seguro de que deseas cerrar? La consulta está en progreso."
        )
      ) {
        resetModal();
        onClose();
      }
    } else if (consultationStatus === "TERMINADO" || isLoading) {
      // No permitir cerrar durante el guardado
      return;
    } else {
      resetModal();
      onClose();
    }
  };

  const resetModal = () => {
    setConsultationStatus("PROGRAMADO");
    setStartTime(null);
    setFormData({
      notasTratamiento: "",
      comentarios: "",
    });
    setErrors({});
  };

  const getElapsedTime = () => {
    if (!startTime) return "00:00";
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getStatusColor = (status: ConsultationStatus) => {
    switch (status) {
      case "PROGRAMADO":
        return "bg-gray-100 text-gray-700";
      case "EN_CURSO":
        return "bg-blue-100 text-blue-700";
      case "TERMINADO":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: ConsultationStatus) => {
    switch (status) {
      case "PROGRAMADO":
        return "No iniciada";
      case "EN_CURSO":
        return "En progreso";
      case "TERMINADO":
        return "Finalizando";

      default:
        return "Desconocido";
    }
  };

  const getStatusIcon = (status: ConsultationStatus) => {
    switch (status) {
      case "PROGRAMADO":
        return <Play className="w-4 h-4" />;
      case "EN_CURSO":
        return <Clock className="w-4 h-4" />;
      case "TERMINADO":
        return <AlertCircle className="w-4 h-4" />;

      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Consulta Médica
          </DialogTitle>
          <DialogDescription>
            Gestiona la consulta del paciente{" "}
            {appointment.paciente.usuario.nombre}{" "}
            {appointment.paciente.usuario.apellido}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado de la consulta */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(consultationStatus)}
              <div>
                <p className="font-medium">Estado de la consulta</p>
                <Badge className={getStatusColor(consultationStatus)}>
                  {getStatusText(consultationStatus)}
                </Badge>
              </div>
            </div>
            {consultationStatus === "EN_CURSO" && startTime && (
              <div className="text-right">
                <p className="text-sm text-slate-600">Tiempo transcurrido</p>
                <p className="text-lg font-mono font-bold text-blue-600">
                  {getElapsedTime()}
                </p>
              </div>
            )}
          </div>

          {/* Información del paciente */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Información del Paciente
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">Nombre</p>
                <p className="font-medium">
                  {appointment.paciente.usuario.nombre}{" "}
                  {appointment.paciente.usuario.apellido}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Teléfono</p>
                <p className="font-medium">
                  {appointment.paciente.usuario.telefono || "Sin teléfono"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-medium">
                  {appointment.paciente.usuario.email || "Sin email"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Tratamiento</p>
                <p className="font-medium">
                  {appointment.notasTratamiento || "Sin tratamiento"}
                </p>
              </div>
            </div>
          </div>

          {/* Información del turno */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Detalles del Turno
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">Fecha y Hora</p>
                <p className="font-medium">
                  {new Date(appointment.fechaHora).toLocaleDateString("es-ES")}{" "}
                  -{" "}
                  {new Date(appointment.fechaHora).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {appointment.notasTratamiento && (
                <div className="col-span-2">
                  <p className="text-sm text-slate-600">Notas previas</p>
                  <p className="font-medium">{appointment.notasTratamiento}</p>
                </div>
              )}
            </div>
          </div>

          {/* Formulario de consulta - Solo visible cuando está en progreso o completando */}
          {(consultationStatus === "EN_CURSO" ||
            consultationStatus === "TERMINADO") && (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold">Registro de la Consulta</h3>

                <div className="space-y-2">
                  <Label htmlFor="notasTratamiento">
                    Notas del Tratamiento *
                  </Label>
                  <Textarea
                    id="notasTratamiento"
                    placeholder="Describe el tratamiento realizado, observaciones clínicas, procedimientos aplicados..."
                    value={formData.notasTratamiento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notasTratamiento: e.target.value,
                      })
                    }
                    className={`min-h-[120px] ${
                      errors.notasTratamiento ? "border-red-500" : ""
                    }`}
                    disabled={consultationStatus === "TERMINADO" && isLoading}
                  />
                  {errors.notasTratamiento && (
                    <p className="text-sm text-red-600">
                      {errors.notasTratamiento}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comentarios">Comentarios Adicionales</Label>
                  <Textarea
                    id="comentarios"
                    placeholder="Recomendaciones para el paciente, próximos pasos, observaciones adicionales..."
                    value={formData.comentarios}
                    onChange={(e) =>
                      setFormData({ ...formData, comentarios: e.target.value })
                    }
                    className="min-h-[80px]"
                    disabled={consultationStatus === "TERMINADO" && isLoading}
                  />
                </div>
              </div>
            </>
          )}

          {/* Estado TERMINADO */}
          {consultationStatus === "TERMINADO" && (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                ¡Consulta Completada!
              </h3>
              <p className="text-slate-600">
                La consulta ha sido registrada exitosamente.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between flex-col">
          {consultationStatus === "PROGRAMADO" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleStartConsultation}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Consulta
              </Button>
            </>
          )}

          {consultationStatus === "EN_CURSO" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Pausar y Cerrar
              </Button>
              <Button
                onClick={handleCompleteConsultation}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Finalizar Consulta
              </Button>
            </>
          )}

          {consultationStatus === "TERMINADO" && (
            <>
              <Button
                variant="outline"
                onClick={() => setConsultationStatus("EN_CURSO")}
                disabled={isLoading}
              >
                Volver a Editar
              </Button>
              <Button
                onClick={handleFinishConsultation}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar y Guardar
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
