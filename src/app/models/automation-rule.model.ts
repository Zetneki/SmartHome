export interface AutomationRule {
  id: string;
  deviceId: string;
  condition: string; // Pl. "temperature < 20"
  action: string; // Pl. "turn on heating"
}
