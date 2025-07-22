import { SPRING_URL } from "@/constants/spring-url";

export const obtenerPacientes = async ({ token }: { token: string }) => {
  try {
    const response = await fetch(`${SPRING_URL}/api/paciente`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pacientes");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching pacientes:", error);
    return [];
  }
};
