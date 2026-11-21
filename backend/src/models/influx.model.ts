export interface InfluxEstufasOnline {
    estufa_id: string;
    _time: string;
    lum: number;
    temperatura: number;
    um_ar: number;
    um_solo: number;
}
export interface InfluxEstufaData {
    _time: string;
    _field: string;
    _value: number;
} 
export interface InfluxTemperatura {
    _time: string,
    _value: number
}
export interface InfluxReservatorio {
    _value: number
}
