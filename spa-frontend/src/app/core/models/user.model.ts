import type { Rol } from '../enums/rol.enum';
import type { Cliente } from './cliente.model';
import type { Empleado } from './empleado.model';

export interface User {
  id: number;
  nombre: string;
  email: string;
  username: string | null;
  rol: Rol;
  telefono: string | null;
  fechaNacimiento: string | null;
  sexo: 'Masculino' | 'Femenino' | 'Otro' | null;
  avatarUrl: string | null;
  fechaRegistro: string;
  cliente?: Cliente;
  empleado?: Empleado;
}
