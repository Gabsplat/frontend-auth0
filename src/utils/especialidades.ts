import { SPRING_URL } from "@/constants/spring-url";

export const obtenerEspecialidades = async ({ token }: { token: string }) => {
  try {
    const response = await fetch(`${SPRING_URL}/api/especialidades`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch especialidades");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching especialidades:", error);
    return [];
  }
};

export const crearEspecialidad = async ({
  nombre,
  token,
}: {
  nombre: string;
  token: string | null;
}) => {
  try {
    const response = await fetch(`${SPRING_URL}/api/especialidades/crear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre }),
    });

    if (!response.ok) {
      throw new Error("Failed to create especialidad");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating especialidad:", error);
  }
};

export const eliminarEspecialidad = async ({
  especialidadId,
  token,
}: {
  especialidadId: string;
  token: string | null;
}) => {
  try {
    const response = await fetch(
      `${SPRING_URL}/api/especialidades/${especialidadId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete especialidad");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting especialidad:", error);
  }
};

export const updateEspecialidad = async ({
  especialidadId,
  nombre,
  token,
}: {
  especialidadId: string;
  nombre: string;
  token: string | null;
}) => {
  try {
    const response = await fetch(
      `${SPRING_URL}/api/especialidades/${especialidadId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update especialidad");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating especialidad:", error);
  }
};
