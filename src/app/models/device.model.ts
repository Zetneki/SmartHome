export interface Device {
  id: string;
  name: string;
  type: 'lamp' | 'thermostat' | 'camera' | 'sensor';
  status: boolean;
  roomId: string;
}
