import { Room } from './room.model';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  rooms: Room[];
}
