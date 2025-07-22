/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { obtenerTurnosPorPaciente } from "@/utils/turnos";
import type { Turno } from "@/types/Turno";

export default function PacienteDashboard() {
  const [activeTab, setActiveTab] = useState("appointments");

  const [appointments, setAppointments] = useState<Turno[]>([]);

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

    try {
      console.log("backendUser:", backendUser);
      const turnos = await obtenerTurnosPorPaciente({
        pacienteId: backendUser?.id,
        token,
      });

      console.log("Turnos fetched successfully:", turnos);
      setAppointments(turnos);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Mi Portal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === "appointments" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("appointments")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Mis Turnos
                </Button>
                <Button
                  variant={activeTab === "history" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("history")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Historia Clínica
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "appointments" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Mis Turnos
                  </h2>
                </div>

                <div className="grid gap-4">
                  {appointments.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800">
                                Turno #{appointment.id}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {appointment.dentista.usuario.nombre +
                                  " " +
                                  appointment.dentista.usuario.apellido}{" "}
                                - {appointment.dentista.especialidad.nombre}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-slate-500 flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(
                                    appointment.fechaHora
                                  ).toLocaleDateString("es-AR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  })}
                                </span>
                                <span className="text-sm text-slate-500 flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {new Date(
                                    appointment.fechaHora
                                  ).toLocaleTimeString("es-AR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge
                              variant={
                                appointment.estado === "PROGRAMADO"
                                  ? "default"
                                  : appointment.estado === "EN_CURSO"
                                  ? "secondary"
                                  : appointment.estado === "TERMINADO"
                                  ? "outline"
                                  : appointment.estado === "CANCELADO"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={
                                appointment.estado === "PROGRAMADO"
                                  ? "bg-blue-100 text-blue-700"
                                  : appointment.estado === "EN_CURSO"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : appointment.estado === "TERMINADO"
                                  ? "bg-green-100 text-green-700"
                                  : appointment.estado === "CANCELADO"
                                  ? "bg-red-100 text-red-700"
                                  : ""
                              }
                            >
                              {appointment.estado === "PROGRAMADO"
                                ? "Programado"
                                : appointment.estado === "EN_CURSO"
                                ? "En curso"
                                : appointment.estado === "TERMINADO"
                                ? "Terminado"
                                : appointment.estado === "CANCELADO"
                                ? "Cancelado"
                                : appointment.estado}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Historia Clínica
                </h2>

                <div className="grid gap-6">
                  {appointments
                    .filter((appointment) => appointment.estado === "TERMINADO")
                    .map((appointment, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                Consulta con{" "}
                                {appointment.dentista.usuario.nombre +
                                  " " +
                                  appointment.dentista.usuario.apellido}{" "}
                                - {appointment.dentista.especialidad.nombre}
                              </CardTitle>
                              <CardDescription>
                                {new Date(
                                  appointment.fechaHora
                                ).toLocaleTimeString("es-AR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </CardDescription>
                            </div>
                            <Badge variant="outline">
                              {" "}
                              {new Date(
                                appointment.fechaHora
                              ).toLocaleDateString("es-AR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-700 mb-4">
                            {appointment.notasTratamiento}
                          </p>
                          <p className="text-slate-500 mb-4 italic">
                            {appointment.comentarios}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
