
export interface EstufaOnline {
    id: string;
    lastSeen: string;
    variables: {
        lum: number | null;
        temperatura: number | null;
        um_ar: number | null;
        um_solo: number | null;
    }
}
export interface Variable {
    id: string;
    name: string;
    value: number | null;
    status: string;
}
export interface EstufaData {
    timestamp: {
        time: string;
        hour: number;
        minute: number;
        date: string;
        day: number;
        month: number;
        year: number;
    };
    co2: number;
    lum: number;
    reservatorio: number;
    temperatura: number;
    um_ar: number;
    um_solo: number;
}
export interface Temperatura {
    time: string;
    value: number;
} 
export interface Reservatorio {
    value: number;
}