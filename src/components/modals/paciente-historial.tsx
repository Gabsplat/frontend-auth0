import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Phone,
  Mail,
  Loader2,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  XCircle,
  PlayCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { obtenerTurnosPorPaciente } from "@/utils/turnos";
import type { Paciente } from "@/types/Usuarios";
import type { Turno } from "@/types/Turno";

interface PatientHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Paciente | null;
}

export function PacienteHistorialModal({
  isOpen,
  onClose,
  patient,
}: PatientHistoryModalProps) {
  const [appointments, setAppointments] = useState<Turno[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessToken } = useAuth();

  const loadPatientAppointments = async () => {
    if (!patient) return;

    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("No se pudo obtener el token de autenticación");
        return;
      }

      const turnos = await obtenerTurnosPorPaciente({
        pacienteId: patient.id,
        token,
      });

      const sortedTurnos = turnos.sort(
        (a: Turno, b: Turno) =>
          new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
      );

      setAppointments(sortedTurnos);
    } catch (error) {
      console.error("Error loading patient appointments:", error);
      toast.error("Error al cargar el historial del paciente");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && patient) {
      loadPatientAppointments();
    }
  }, [isOpen, patient]);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "TERMINADO":
        return "bg-green-100 text-green-700 border-green-200";
      case "PROGRAMADO":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "EN_CURSO":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "CANCELADO":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "TERMINADO":
        return <CheckCircle className="w-4 h-4" />;
      case "PROGRAMADO":
        return <Calendar className="w-4 h-4" />;
      case "EN_CURSO":
        return <PlayCircle className="w-4 h-4" />;
      case "CANCELADO":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case "TERMINADO":
        return "Completado";
      case "PROGRAMADO":
        return "Programado";
      case "EN_CURSO":
        return "En Curso";
      case "CANCELADO":
        return "Cancelado";
      default:
        return estado;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getAppointmentStats = () => {
    const total = appointments.length;
    const completed = appointments.filter(
      (apt) => apt.estado === "TERMINADO"
    ).length;
    const upcoming = appointments.filter(
      (apt) => apt.estado === "PROGRAMADO"
    ).length;
    const cancelled = appointments.filter(
      (apt) => apt.estado === "CANCELADO"
    ).length;

    return { total, completed, upcoming, cancelled };
  };

  if (!patient) return null;

  const stats = getAppointmentStats();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <FileText className="w-6 h-6 text-blue-600" />
            Historia Clínica
          </DialogTitle>
          <DialogDescription className="text-base">
            Historial completo de consultas y tratamientos
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {patient.usuario.nombre} {patient.usuario.apellido}
                </h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                  {patient.usuario.email && (
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {patient.usuario.email}
                    </span>
                  )}
                  {patient.usuario.telefono && (
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {patient.usuario.telefono}
                    </span>
                  )}
                  {patient.usuario.dni && (
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      DNI: {patient.usuario.dni}
                    </span>
                  )}
                </div>
                {patient.obraSocial && (
                  <div className="mt-2">
                    <Badge variant="outline" className="bg-white">
                      Obra Social: {patient.obraSocial}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </p>
                <p className="text-xs text-slate-600">Total Consultas</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
                <p className="text-xs text-slate-600">Completadas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Historial de Consultas ({appointments.length})
            </h4>
            {stats.upcoming > 0 && (
              <Badge className="bg-blue-100 text-blue-700">
                {stats.upcoming} próximas citas
              </Badge>
            )}
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-slate-600">Cargando historial...</p>
                </div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">
                  No hay consultas registradas
                </p>
                <p className="text-slate-400 text-sm">
                  El historial aparecerá aquí cuando se registren consultas
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-slate-800 text-lg">
                              Consulta con {appointment.dentista.usuario.nombre}{" "}
                              {appointment.dentista.usuario.apellido}
                            </h5>
                            <p className="text-sm text-slate-600">
                              {appointment.dentista.especialidad.nombre}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-slate-500 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDateTime(appointment.fechaHora)}
                              </span>
                              <span className="text-sm text-slate-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTime(appointment.fechaHora)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-600 mb-1">
                              {formatDate(appointment.fechaHora)}
                            </p>
                            <Badge
                              className={getStatusColor(appointment.estado)}
                            >
                              {getStatusIcon(appointment.estado)}
                              <span className="ml-1">
                                {getStatusText(appointment.estado)}
                              </span>
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {appointment.notasTratamiento && (
                        <div className="bg-slate-50 rounded-lg p-4 mb-4">
                          <h6 className="font-medium text-slate-800 mb-2 flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            Notas del Tratamiento
                          </h6>
                          <p className="text-slate-700 leading-relaxed">
                            {appointment.notasTratamiento}
                          </p>
                        </div>
                      )}

                      {appointment.comentarios && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <h6 className="font-medium text-blue-800 mb-2 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Recomendaciones y Comentarios
                          </h6>
                          <p className="text-blue-700 leading-relaxed italic">
                            {appointment.comentarios}
                          </p>
                        </div>
                      )}

                      {!appointment.notasTratamiento &&
                        !appointment.comentarios &&
                        appointment.estado === "PROGRAMADO" && (
                          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <p className="text-yellow-700 text-sm flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Consulta programada - Las notas aparecerán después
                              de la cita
                            </p>
                          </div>
                        )}

                      {!appointment.notasTratamiento &&
                        !appointment.comentarios &&
                        appointment.estado === "CANCELADO" && (
                          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <p className="text-red-700 text-sm flex items-center">
                              <XCircle className="w-4 h-4 mr-2" />
                              Consulta cancelada
                            </p>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-slate-500">
            {appointments.length > 0 && (
              <span>
                Última actualización:{" "}
                {formatDateTime(
                  appointments[0]?.fechaHora || new Date().toISOString()
                )}
              </span>
            )}
          </div>
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
