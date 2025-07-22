import type { Dentista, Paciente } from "./Usuarios";

export type CrearTurno = {
  pacienteId: string;
  dentistaId: string;
  fechaHora: string;
};

export type ConsultaMedica = {
  estado: string;
  notasTratamiento?: string;
  comentarios?: string;
};

export type Turno = {
  id: number;
  paciente: Paciente;
  dentista: Dentista;
  fechaHora: string;
  estado: string;
  notasTratamiento?: string;
  comentarios?: string;
};

export type TurnoEstado = "PROGRAMADO" | "EN_CURSO" | "TERMINADO" | "CANCELADO";
