import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { getStatusColor, obtenerTurnosPorDentista } from "@/utils/turnos";
import type { Turno } from "@/types/Turno";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  Phone,
  Settings,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PacienteHistorialModal } from "@/components/modals/paciente-historial";
import { ConsultationModal } from "@/components/modals/editar-turno";

export default function DentistaDashboard() {
  const [appointments, setAppointments] = useState<Turno[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Turno | null>(
    null
  );
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  const { getAccessToken, backendUser } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const t = await getAccessToken();
      setToken(t);
    };
    fetchToken();
  }, [getAccessToken]);

  useEffect(() => {
    if (token) {
      handleFetchTurnos();
    }
  }, [token]);

  const handleFetchTurnos = async () => {
    if (!token) return;

    setLoading(true);
    try {
      console.log("backendUser:", backendUser);
      const turnos = await obtenerTurnosPorDentista({
        dentistaId: backendUser?.id,
        token,
      });

      console.log("Turnos fetched successfully:", turnos);
      setAppointments(turnos);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = (appointment: any) => {
    console.log("Starting consultation for appointment:", appointment);
    setSelectedAppointment(appointment);
    setIsConsultationModalOpen(true);
  };

  const handleViewHistory = (patient: any) => {
    console.log("Viewing history for patient:", patient);
    setSelectedPatient(patient);
    setIsHistoryModalOpen(true);
  };

  const handleConsultationSuccess = () => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === selectedAppointment?.id
          ? { ...apt, estado: "COMPLETADO" }
          : apt
      )
    );
    setIsConsultationModalOpen(false);
    setSelectedAppointment(null);
    toast.success("Consulta completada exitosamente");
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br  from-slate-50 via-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Panel Profesional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === "today" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("today")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Turnos Hoy
                </Button>
                <Button
                  variant={activeTab === "schedule" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("schedule")}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Mi Agenda
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "today" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Turnos de Hoy
                  </h2>
                  <Badge className="bg-blue-100 text-blue-700">
                    {new Date().toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Badge>
                </div>

                <div className="grid gap-4">
                  {appointments
                    .filter((ap) => {
                      const appointmentDate = new Date(ap.fechaHora);
                      const today = new Date();
                      return (
                        appointmentDate.getDate() === today.getDate() &&
                        appointmentDate.getMonth() === today.getMonth() &&
                        appointmentDate.getFullYear() === today.getFullYear()
                      );
                    })
                    .filter((ap) => ap.estado === "PROGRAMADO")
                    .map((ap) => (
                      <Card
                        key={ap.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-8 h-8 text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold text-slate-800">
                                    {new Date(ap.fechaHora).toLocaleTimeString(
                                      "es-ES",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </h3>
                                </div>
                                <p className="text-lg font-medium text-slate-700">
                                  {ap.paciente.usuario.nombre}{" "}
                                  {ap.paciente.usuario.apellido}
                                </p>

                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-sm text-slate-500 flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {ap.paciente.usuario.telefono ||
                                      "No disponible"}
                                  </span>
                                  <span className="text-sm text-slate-500 flex items-center">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {ap.paciente.usuario.email ||
                                      "No disponible"}
                                  </span>
                                </div>
                                {ap.notasTratamiento && (
                                  <p className="text-sm text-slate-500 mt-1 italic">
                                    {ap.notasTratamiento.slice(0, 50)}...
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge className={getStatusColor(ap.estado)}>
                                {ap.estado}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewHistory(ap.paciente)}
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                Historia
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleStartConsultation(ap)}
                                disabled={ap.estado !== "PROGRAMADO"}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Iniciar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">Mi Agenda</h2>

                <div className="grid md:grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Próximos Días</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {appointments
                          .filter((ap) => {
                            const appointmentDate = new Date(ap.fechaHora);
                            const today = new Date();

                            appointmentDate.setHours(0, 0, 0, 0);
                            today.setHours(0, 0, 0, 0);
                            return appointmentDate > today;
                          })
                          .filter((ap) => ap.estado === "PROGRAMADO")
                          .sort(
                            (a, b) =>
                              new Date(a.fechaHora).getTime() -
                              new Date(b.fechaHora).getTime()
                          )
                          .map((ap) => (
                            <div
                              key={ap.id}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-slate-800">
                                  {new Date(ap.fechaHora).toLocaleDateString(
                                    "es-ES",
                                    {
                                      weekday: "long",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </p>
                                <span className="text-sm text-slate-500">
                                  {new Date(ap.fechaHora).toLocaleTimeString(
                                    "es-ES",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>
                              <Badge variant="outline">
                                {ap.paciente.usuario.nombre}{" "}
                                {ap.paciente.usuario.apellido}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PacienteHistorialModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          console.log("Closing history modal");
          setIsHistoryModalOpen(false);
          setSelectedAppointment(null);
        }}
        patient={selectedPatient}
      />

      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => {
          setIsConsultationModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSuccess={handleConsultationSuccess}
        appointment={selectedAppointment}
      />
    </div>
  );
}
