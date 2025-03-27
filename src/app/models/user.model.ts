export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  configuration: {
    smartLight: boolean;
    smartPlug: boolean;
    solarPanel: boolean;
    [key: string]: boolean; // Bármilyen további eszköz engedélyezése
  };
}
