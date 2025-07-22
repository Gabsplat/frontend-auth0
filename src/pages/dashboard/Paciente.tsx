import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  FileText,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Download,
  Plus,
} from "lucide-react";

const appointments = [
  {
    id: 1,
    date: "2024-01-15",
    time: "10:00",
    doctor: "Dr. Martínez",
    specialty: "Ortodoncia",
    status: "confirmed",
    type: "Control mensual",
  },
  {
    id: 2,
    date: "2024-01-22",
    time: "14:30",
    doctor: "Dra. López",
    specialty: "Limpieza",
    status: "pending",
    type: "Limpieza dental",
  },
];

const medicalHistory = [
  {
    date: "2023-12-10",
    treatment: "Colocación de brackets",
    doctor: "Dr. Martínez",
    notes:
      "Inicio de tratamiento ortodóntico. Paciente tolera bien el procedimiento.",
    files: ["radiografia_inicial.pdf", "plan_tratamiento.pdf"],
  },
  {
    date: "2023-11-15",
    treatment: "Limpieza dental profunda",
    doctor: "Dra. López",
    notes: "Limpieza completa. Se recomienda control en 6 meses.",
    files: ["informe_limpieza.pdf"],
  },
];

export default function PacienteDashboard() {
  const [activeTab, setActiveTab] = useState("appointments");

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
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Mi Perfil
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
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Turno
                  </Button>
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
                                {appointment.type}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {appointment.doctor} - {appointment.specialty}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-slate-500 flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {appointment.date}
                                </span>
                                <span className="text-sm text-slate-500 flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {appointment.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge
                              variant={
                                appointment.status === "confirmed"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                appointment.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : ""
                              }
                            >
                              {appointment.status === "confirmed"
                                ? "Confirmado"
                                : "Pendiente"}
                            </Badge>
                            <Button variant="outline" size="sm">
                              Modificar
                            </Button>
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
                  {medicalHistory.map((record, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {record.treatment}
                            </CardTitle>
                            <CardDescription>
                              {record.doctor} - {record.date}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">{record.date}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-700 mb-4">{record.notes}</p>
                        {record.files.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-slate-800 mb-2">
                              Archivos adjuntos:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {record.files.map((file, fileIndex) => (
                                <Button
                                  key={fileIndex}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs bg-transparent"
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  {file}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">Mi Perfil</h2>

                <Card>
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Nombre completo
                        </label>
                        <p className="text-slate-900">María González</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          DNI
                        </label>
                        <p className="text-slate-900">12.345.678</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Teléfono
                        </label>
                        <p className="text-slate-900 flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          +54 11 1234-5678
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Email
                        </label>
                        <p className="text-slate-900 flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          maria.gonzalez@email.com
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-slate-700">
                          Dirección
                        </label>
                        <p className="text-slate-900 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Av. Rivadavia 1234, CABA
                        </p>
                      </div>
                    </div>
                    <Button className="mt-4">Editar Información</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
