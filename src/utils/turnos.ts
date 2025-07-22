import { SPRING_URL } from "@/constants/spring-url";
import type { ConsultaMedica, CrearTurno } from "@/types/Turno";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "CONFIRMADO":
      return "bg-green-100 text-green-700";
    case "PENDIENTE":
      return "bg-yellow-100 text-yellow-700";
    case "CANCELADO":
      return "bg-red-100 text-red-700";
    case "COMPLETADO":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const obtenerTurnos = async ({ token }: { token: string }) => {
  try {
    const response = await fetch(`${SPRING_URL}/api/turno`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch turnos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching turnos:", error);
    return [];
  }
};

export const obtenerTurnosPorDentista = async ({
  dentistaId,
  token,
}: {
  dentistaId: number | undefined;
  token: string | null;
}) => {
  try {
    if (!token) {
      throw new Error("Token is required to fetch turnos");
    }
    if (!dentistaId) {
      throw new Error("Dentista ID is required to fetch turnos");
    }
    const response = await fetch(
      `${SPRING_URL}/api/turno/dentista/${dentistaId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch turnos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching turnos:", error);
    return [];
  }
};

export const crearTurno = async ({
  appointmentForm,
  token,
}: {
  appointmentForm: CrearTurno;
  token: string | null;
}) => {
  try {
    const response = await fetch(SPRING_URL + "/api/turno/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pacienteId: Number.parseInt(appointmentForm.pacienteId),
        dentistaId: Number.parseInt(appointmentForm.dentistaId),
        fechaHora: appointmentForm.fechaHora,
      }),
    });

    return response;
  } catch (error) {
    console.error("Error creating appointment:", error);
  }
};

export const actualizarTurno = async ({
  appointmentForm,
  token,
  selectedAppointment,
}: {
  appointmentForm: CrearTurno;
  token: string | null;
  selectedAppointment: { id: number };
}) => {
  try {
    const response = await fetch(
      SPRING_URL + `/api/turno/actualizar/${selectedAppointment.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pacienteId: Number.parseInt(appointmentForm.pacienteId),
          dentistaId: Number.parseInt(appointmentForm.dentistaId),
          fechaHora: appointmentForm.fechaHora,
        }),
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating appointment:", error);
  }
};

export const cancelarTurno = async ({
  id,
  token,
}: {
  id: number;
  token: string | null;
}) => {
  try {
    const response = await fetch(SPRING_URL + `/api/turno/estado/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        estado: "CANCELADO",
      }),
    });
    return response;
  } catch (error) {
    console.error("Error canceling appointment:", error);
  }
};

export const eliminarTurno = async ({
  id,
  token,
}: {
  id: number;
  token: string | null;
}) => {
  try {
    const response = await fetch(SPRING_URL + `/api/turno/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error deleting appointment:", error);
  }
};

export const actualizarConsulta = async ({
  turnoId,
  data,
  token,
}: {
  turnoId: number;
  data: ConsultaMedica;
  token: string | null;
}) => {
  try {
    if (!token) {
      throw new Error("Token is required to update consulta");
    }
    const response = await fetch(
      `${SPRING_URL}/api/turno/actualizar/${turnoId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update consulta");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating consulta:", error);
    console.error("Error updating consulta:", error);
  }
};

export const iniciarConsulta = async ({
  turnoId,
  token,
}: {
  turnoId: number | null;
  token: string | null;
}) => {
  try {
    const response = await fetch(SPRING_URL + `/api/turno/estado/${turnoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        estado: "EN_CURSO",
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error starting consulta:", error);
  }
};
