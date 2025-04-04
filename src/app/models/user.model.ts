import { Room } from './room.model';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  password: string;
  rooms: Room[];
}
