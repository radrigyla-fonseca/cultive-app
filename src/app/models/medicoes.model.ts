export interface InfluxRecord {
  timestamp: {};
  co2: number;
  lum: number;
  reservatorio: number;
  temperatura: number;
  um_ar: number;
  um_solo: number;
}

export interface ApiResponse<T> {
  success: boolean; 
  data: T;
  message?: string;
}