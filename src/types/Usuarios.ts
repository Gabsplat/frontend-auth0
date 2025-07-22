import type { Especialidad } from "./Especialidad";

export type Usuario = {
  id: number;
  auth0Id: string;
  nombre: string;
  apellido: string;
  dni: string | null;
  email: string;
  fechaNacimiento: string | null;
  telefono: string | null;
};

export type Paciente = {
  id: number;
  obraSocial: string | null;
  telefonoEmergencia: string | null;
  usuario: Usuario;
};

export type Dentista = {
  id: number;
  especialidad: Especialidad;
  matricula: string;
  usuario: Usuario;
};

export type Administrador = {
  id: number;
  usuario: Usuario;
};
