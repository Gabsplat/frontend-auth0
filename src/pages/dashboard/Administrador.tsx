import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Shield, Stethoscope } from "lucide-react";
import ListadoEspecialidades from "@/components/dashboard/ListadoEspecialidades";
import ListadoDentistas from "@/components/dashboard/ListadoDentistas";
import ListadoPacientes from "@/components/dashboard/ListadoPacientes";
import ListadoTurnos from "@/components/dashboard/ListadoTurnos";
import { useState } from "react";

export default function AdministradorDashboard() {
  const [activeTab, setActiveTab] = useState("appointments");
  return (
    <div className="container mx-auto px-4 pt-32">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg">Administración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={activeTab === "dentists" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("dentists")}
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Dentistas
              </Button>
              <Button
                variant={activeTab === "patients" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("patients")}
              >
                <Users className="w-4 h-4 mr-2" />
                Pacientes
              </Button>
              <Button
                variant={activeTab === "specialties" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("specialties")}
              >
                <Shield className="w-4 h-4 mr-2" />
                Especialidades
              </Button>
              <Button
                variant={activeTab === "appointments" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("appointments")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Turnos
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {activeTab === "dentists" && <ListadoDentistas />}
          {activeTab === "patients" && <ListadoPacientes />}
          {activeTab === "specialties" && <ListadoEspecialidades />}
          {activeTab === "appointments" && <ListadoTurnos />}
        </div>
      </div>
    </div>
  );
}
