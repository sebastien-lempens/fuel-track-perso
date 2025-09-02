export interface RawFuelEntry {
  id: string;
  date: string; // ISO string format
  liters: number;
  priceTotalLiter: number;
  odometer: number;
}

export interface FuelEntry extends RawFuelEntry {
  tripDistance?: number;
  l100km?: number;
  totalCost: number;
}

export interface Stats {
    averageConsumption: number;
    totalCost: number;
    totalDistance: number;
}
