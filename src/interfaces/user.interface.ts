export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    rol: RolUser;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }
  
  export enum RolUser {
    ADMIN = 'ADMIN',
    RECEPCIONISTA = 'RECEPCIONISTA',
    GERENTE = 'GERENTE',
    USER = 'USER',
  }