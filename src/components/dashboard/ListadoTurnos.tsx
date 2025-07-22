import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, X, Check, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import type { Turno } from "@/types/Turno";
import type { Dentista, Paciente } from "@/types/Usuarios";
import { useAuth } from "@/context/AuthContext";
import {
  actualizarTurno,
  cancelarTurno,
  crearTurno,
  eliminarTurno,
  getStatusColor,
  obtenerTurnos,
} from "@/utils/turnos";
import { obtenerPacientes } from "@/utils/pacientes";
import { obtenerDentistas } from "@/utils/dentistas";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface AppointmentForm {
  pacienteId: string;
  dentistaId: string;
  fecha: Date | undefined;
  hora: string;
}

export default function ListadoTurnos() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [dentistas, setDentistas] = useState<Dentista[]>([]);
  const [appointments, setAppointments] = useState<Turno[]>([]);
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Turno | null>(
    null
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isEditDatePickerOpen, setIsEditDatePickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>({
    pacienteId: "",
    dentistaId: "",
    fecha: undefined,
    hora: "09:00",
  });

  const [editForm, setEditForm] = useState<AppointmentForm>({
    pacienteId: "",
    dentistaId: "",
    fecha: undefined,
    hora: "09:00",
  });

  const { getAccessToken } = useAuth();
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
      const [turnos, pacientesData, dentistasData] = await Promise.all([
        obtenerTurnos({ token }),
        obtenerPacientes({ token }),
        obtenerDentistas({ token }),
      ]);

      setAppointments(turnos);
      setPacientes(pacientesData);
      setDentistas(dentistasData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetAppointmentForm = () => {
    setAppointmentForm({
      pacienteId: "",
      dentistaId: "",
      fecha: undefined,
      hora: "09:00",
    });
  };

  const resetEditForm = () => {
    setEditForm({
      pacienteId: "",
      dentistaId: "",
      fecha: undefined,
      hora: "09:00",
    });
  };

  const handleChangeAppointmentStatus = async (id: number) => {
    if (!token) return;

    try {
      const response = await cancelarTurno({
        id,
        token,
      });
      if (response && response.ok) {
        const updatedAppointment = await response.json();
        setAppointments(
          appointments.map((apt) => (apt.id === id ? updatedAppointment : apt))
        );
      }
    } catch (error) {
      console.error("Error changing appointment status:", error);
    }
  };

  const handleCrearTurno = async () => {
    if (
      !token ||
      !appointmentForm.fecha ||
      !appointmentForm.pacienteId ||
      !appointmentForm.dentistaId
    ) {
      return;
    }

    setLoading(true);
    try {
      const fechaHora = new Date(appointmentForm.fecha);
      const [hours, minutes] = appointmentForm.hora.split(":");
      fechaHora.setHours(Number.parseInt(hours), Number.parseInt(minutes));

      const response = await crearTurno({
        appointmentForm: {
          pacienteId: appointmentForm.pacienteId,
          dentistaId: appointmentForm.dentistaId,
          fechaHora: fechaHora.toISOString(),
        },
        token,
      });

      if (response?.status === 409) {
        toast.error("Ya existe un turno para esta fecha y hora");
        return;
      }

      if (response && response.ok) {
        const newAppointment = await response.json();
        setAppointments([...appointments, newAppointment]);
        setIsCreateAppointmentOpen(false);
        resetAppointmentForm();
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditAppointment = (appointment: Turno) => {
    setSelectedAppointment(appointment);
    const appointmentDate = new Date(appointment.fechaHora);
    const timeString = format(appointmentDate, "HH:mm");

    setEditForm({
      pacienteId: appointment.paciente.id.toString(),
      dentistaId: appointment.dentista.id.toString(),
      fecha: appointmentDate,
      hora: timeString,
    });
    setIsEditAppointmentOpen(true);
  };

  const handleUpdateAppointment = async () => {
    if (!token || !selectedAppointment || !editForm.fecha) return;

    setLoading(true);
    try {
      const fechaHora = new Date(editForm.fecha);
      const [hours, minutes] = editForm.hora.split(":");
      fechaHora.setHours(Number.parseInt(hours), Number.parseInt(minutes));

      const response = await actualizarTurno({
        appointmentForm: {
          pacienteId: editForm.pacienteId,
          dentistaId: editForm.dentistaId,
          fechaHora: fechaHora.toISOString(),
        },
        token,
        selectedAppointment,
      });

      if (response && response.ok) {
        const updatedAppointment = await response.json();
        setAppointments(
          appointments.map((apt) =>
            apt.id === selectedAppointment.id ? updatedAppointment : apt
          )
        );
        setIsEditAppointmentOpen(false);
        resetEditForm();
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!token || !selectedAppointment) return;

    setLoading(true);
    try {
      const response = await eliminarTurno({
        id: selectedAppointment.id,
        token,
      });

      if (response && response.ok) {
        setAppointments(
          appointments.filter((apt) => apt.id !== selectedAppointment.id)
        );
        setIsDeleteDialogOpen(false);
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (appointment: Turno) => {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Gestión de Turnos</h2>
        <Dialog
          open={isCreateAppointmentOpen}
          onOpenChange={setIsCreateAppointmentOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Turno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Turno</DialogTitle>
              <DialogDescription>
                Selecciona el paciente, dentista, fecha y hora para el nuevo
                turno.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="patient">Paciente</Label>
                <Select
                  value={appointmentForm.pacienteId}
                  onValueChange={(value) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      pacienteId: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {pacientes.map((paciente) => (
                      <SelectItem
                        key={paciente.id}
                        value={paciente.id.toString()}
                      >
                        {paciente.usuario.nombre} {paciente.usuario.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dentist">Dentista</Label>
                <Select
                  value={appointmentForm.dentistaId}
                  onValueChange={(value) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      dentistaId: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar dentista" />
                  </SelectTrigger>
                  <SelectContent>
                    {dentistas.map((dentista) => (
                      <SelectItem
                        key={dentista.id}
                        value={dentista.id.toString()}
                      >
                        Dr. {dentista.usuario.nombre}{" "}
                        {dentista.usuario.apellido} -{" "}
                        {dentista.especialidad.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Fecha</Label>
                <Popover
                  open={isDatePickerOpen}
                  onOpenChange={setIsDatePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {appointmentForm.fecha ? (
                        format(appointmentForm.fecha, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={appointmentForm.fecha}
                      onSelect={(date) => {
                        setAppointmentForm({
                          ...appointmentForm,
                          fecha: date,
                        });
                        setIsDatePickerOpen(false);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Hora</Label>
                <Input
                  id="time"
                  type="time"
                  value={appointmentForm.hora}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      hora: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateAppointmentOpen(false);
                  resetAppointmentForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCrearTurno}
                disabled={
                  loading ||
                  !appointmentForm.pacienteId ||
                  !appointmentForm.dentistaId ||
                  !appointmentForm.fecha
                }
              >
                {loading ? "Creando..." : "Crear Turno"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {loading && appointments.length === 0 ? (
          <div className="text-center py-8">
            <p>Cargando turnos...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">No hay turnos programados</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-slate-800">
                          {format(new Date(appointment.fechaHora), "PPP", {
                            locale: es,
                          })}
                        </h3>
                        <span className="text-sm text-slate-500">
                          {format(new Date(appointment.fechaHora), "HH:mm")}
                        </span>
                      </div>
                      <p className="text-lg font-medium text-slate-700">
                        {appointment.paciente.usuario.nombre}{" "}
                        {appointment.paciente.usuario.apellido}
                      </p>
                      <p className="text-sm text-slate-600">
                        Dr. {appointment.dentista.usuario.nombre}{" "}
                        {appointment.dentista.usuario.apellido} -{" "}
                        {appointment.dentista.especialidad.nombre}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(appointment.estado)}>
                      {appointment.estado}
                    </Badge>
                    {appointment.estado === "PENDIENTE" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700 bg-transparent"
                        onClick={() =>
                          handleChangeAppointmentStatus(
                            appointment.id,
                            "CONFIRMADO"
                          )
                        }
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    {appointment.estado !== "CANCELADO" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() =>
                          handleChangeAppointmentStatus(
                            appointment.id,
                            "CANCELADO"
                          )
                        }
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditAppointment(appointment)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 bg-transparent"
                      onClick={() => openDeleteDialog(appointment)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog para editar turno */}
      <Dialog
        open={isEditAppointmentOpen}
        onOpenChange={setIsEditAppointmentOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Turno</DialogTitle>
            <DialogDescription>
              Modifica los detalles del turno seleccionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-patient">Paciente</Label>
              <Select
                value={editForm.pacienteId}
                onValueChange={(value) =>
                  setEditForm({
                    ...editForm,
                    pacienteId: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map((paciente) => (
                    <SelectItem
                      key={paciente.id}
                      value={paciente.id.toString()}
                    >
                      {paciente.usuario.nombre} {paciente.usuario.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-dentist">Dentista</Label>
              <Select
                value={editForm.dentistaId}
                onValueChange={(value) =>
                  setEditForm({
                    ...editForm,
                    dentistaId: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar dentista" />
                </SelectTrigger>
                <SelectContent>
                  {dentistas.map((dentista) => (
                    <SelectItem
                      key={dentista.id}
                      value={dentista.id.toString()}
                    >
                      Dr. {dentista.usuario.nombre} {dentista.usuario.apellido}{" "}
                      - {dentista.especialidad.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Fecha</Label>
              <Popover
                open={isEditDatePickerOpen}
                onOpenChange={setIsEditDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editForm.fecha ? (
                      format(editForm.fecha, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editForm.fecha}
                    onSelect={(date) => {
                      setEditForm({
                        ...editForm,
                        fecha: date,
                      });
                      setIsEditDatePickerOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-time">Hora</Label>
              <Input
                id="edit-time"
                type="time"
                value={editForm.hora}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    hora: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditAppointmentOpen(false);
                resetEditForm();
                setSelectedAppointment(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateAppointment}
              disabled={
                loading ||
                !editForm.pacienteId ||
                !editForm.dentistaId ||
                !editForm.fecha
              }
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              turno
              {selectedAppointment && (
                <span className="font-medium">
                  {" "}
                  del{" "}
                  {format(new Date(selectedAppointment.fechaHora), "PPP", {
                    locale: es,
                  })}
                  a las{" "}
                  {format(new Date(selectedAppointment.fechaHora), "HH:mm")}{" "}
                  para{" "}
                  <b>
                    {selectedAppointment.paciente.usuario.nombre}{" "}
                    {selectedAppointment.paciente.usuario.apellido}
                  </b>
                </span>
              )}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAppointment(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAppointment}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
