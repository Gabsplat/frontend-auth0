import { SPRING_URL } from "@/constants/spring-url";

export const obtenerDentistas = async ({ token }: { token: string }) => {
  try {
    const response = await fetch(SPRING_URL + "/api/dentista", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener dentistas");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener dentistas:", error);
    return [];
  }
};

export async function obtenerDentistaPorId({
  dentistaId,
  token,
}: {
  dentistaId: string;
  token: string;
}) {
  const response = await fetch(`${SPRING_URL}/api/dentista/${dentistaId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function actualizarDentista({
  dentistaId,
  data,
  token,
}: {
  dentistaId: string;
  data: { nombre: string; email: string; especialidades: string[] };
  token: string | null;
}) {
  const response = await fetch(
    `${SPRING_URL}/api/dentista/actualizar/${dentistaId}`,
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
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function darDeBajaDentista({
  dentistaId,
  token,
}: {
  dentistaId: string;
  token: string | null;
}) {
  const response = await fetch(
    `${SPRING_URL}/api/dentista/dar-de-baja/${dentistaId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
