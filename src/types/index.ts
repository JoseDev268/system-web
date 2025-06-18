import { RolUser } from '@/interfaces/user.interface';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    rol: RolUser;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
  }

  interface Session {
    user: User | null;
  }
}