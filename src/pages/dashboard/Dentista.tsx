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
import { ConsultationModal } from "@/components/modals/editar-turno";

const upcomingAppointments = [
  { date: "2024-01-16", appointments: 8 },
  { date: "2024-01-17", appointments: 6 },
  { date: "2024-01-18", appointments: 10 },
];

export default function DentistaDashboard() {
  const [appointments, setAppointments] = useState<Turno[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Turno | null>(
    null
  );
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

  const handleConsultationSuccess = () => {
    // Actualizar el estado del turno en la lista
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
                <Button
                  variant={activeTab === "patients" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("patients")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Mis Pacientes
                </Button>
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Mi Perfil
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
                  {appointments.map((ap) => (
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
                                  {ap.paciente.usuario.email || "No disponible"}
                                </span>
                              </div>
                              {ap.notasTratamiento && (
                                <p className="text-sm text-slate-500 mt-1 italic">
                                  {ap.notasTratamiento}
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
                              //   onClick={() =>
                              //     handleViewHistory(ap.paciente)
                              //   }
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

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Próximos Días</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingAppointments.map((day, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-slate-800">
                                {new Date(day.date).toLocaleDateString(
                                  "es-ES",
                                  {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                            <Badge>{day.appointments} turnos</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Horarios de Trabajo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">
                            Lunes - Viernes
                          </span>
                          <span className="text-sm font-medium">
                            8:00 - 18:00
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">
                            Sábados
                          </span>
                          <span className="text-sm font-medium">
                            9:00 - 13:00
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">
                            Domingos
                          </span>
                          <span className="text-sm font-medium text-red-600">
                            Cerrado
                          </span>
                        </div>
                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">
                              Duración promedio consulta
                            </span>
                            <span className="text-sm font-medium">45 min</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Resumen Semanal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">32</p>
                        <p className="text-sm text-slate-600">Total Turnos</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">28</p>
                        <p className="text-sm text-slate-600">Completados</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">3</p>
                        <p className="text-sm text-slate-600">Pendientes</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">1</p>
                        <p className="text-sm text-slate-600">Cancelados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {/* 
            {activeTab === "patients" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Mis Pacientes
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar pacientes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {filteredPatients.map((patient) => (
                    <Card
                      key={patient.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback>
                                {`${patient.nombre} ${patient.apellido}`
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-slate-800">
                                {patient.nombre} {patient.apellido}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {patient.tratamientoActual}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-slate-500 flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {patient.telefono}
                                </span>
                                <span className="text-sm text-slate-500 flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {patient.email}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="text-sm text-slate-600">
                                Última visita:{" "}
                                {new Date(
                                  patient.ultimaVisita
                                ).toLocaleDateString("es-ES")}
                              </p>
                              {patient.proximoTurno && (
                                <p className="text-sm text-slate-600">
                                  Próximo:{" "}
                                  {new Date(
                                    patient.proximoTurno
                                  ).toLocaleDateString("es-ES")}
                                </p>
                              )}
                              <Badge
                                variant={
                                  patient.estado === "Activo"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  patient.estado === "Activo"
                                    ? "bg-green-100 text-green-700"
                                    : ""
                                }
                              >
                                {patient.estado}
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewHistory(patient)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver Historia
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">Mi Perfil</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Información Personal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src="/placeholder.svg?height=64&width=64" />
                          <AvatarFallback>CM</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">
                            Dr. {dentistProfile.nombre}{" "}
                            {dentistProfile.apellido}
                          </h3>
                          <p className="text-slate-600">
                            {dentistProfile.especialidad}
                          </p>
                          <p className="text-sm text-slate-500">
                            Matrícula: {dentistProfile.matricula}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">
                            {dentistProfile.email}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">
                            {dentistProfile.telefono}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">
                            {dentistProfile.horarios}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full mt-4"
                        onClick={() => setIsProfileModalOpen(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Perfil
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Estadísticas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">
                            Pacientes totales
                          </span>
                          <span className="font-semibold">45</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">
                            Consultas este mes
                          </span>
                          <span className="font-semibold">128</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">
                            Promedio diario
                          </span>
                          <span className="font-semibold">6.4</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">
                            Tasa de asistencia
                          </span>
                          <span className="font-semibold text-green-600">
                            94%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => {
          setIsConsultationModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSuccess={handleConsultationSuccess}
        appointment={selectedAppointment}
      />

      {/* Modal para ver historia clínica */}
      {/* <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Historia Clínica</DialogTitle>
            <DialogDescription>
              {selectedPatient &&
                `${selectedPatient.nombre} ${selectedPatient.apellido || ""}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Información del Paciente</h4>
              {selectedPatient && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Email: {selectedPatient.email}</div>
                  <div>Teléfono: {selectedPatient.telefono}</div>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-2">Historial de Consultas</h4>
              <div className="space-y-2">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-medium">
                    Control ortodóntico - 10/01/2024
                  </p>
                  <p className="text-sm text-slate-600">
                    Ajuste de brackets. Evolución favorable.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-medium">
                    Colocación de brackets - 15/12/2023
                  </p>
                  <p className="text-sm text-slate-600">
                    Inicio de tratamiento ortodóntico.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsHistoryModalOpen(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Modal para editar perfil */}
      {/* <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Actualiza tu información personal y profesional.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={dentistProfile.nombre}
                  onChange={(e) =>
                    setDentistProfile({
                      ...dentistProfile,
                      nombre: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={dentistProfile.apellido}
                  onChange={(e) =>
                    setDentistProfile({
                      ...dentistProfile,
                      apellido: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={dentistProfile.email}
                onChange={(e) =>
                  setDentistProfile({
                    ...dentistProfile,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={dentistProfile.telefono}
                onChange={(e) =>
                  setDentistProfile({
                    ...dentistProfile,
                    telefono: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="horarios">Horarios de Trabajo</Label>
              <Textarea
                id="horarios"
                value={dentistProfile.horarios}
                onChange={(e) =>
                  setDentistProfile({
                    ...dentistProfile,
                    horarios: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsProfileModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                toast.success("Perfil actualizado exitosamente");
                setIsProfileModalOpen(false);
              }}
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
