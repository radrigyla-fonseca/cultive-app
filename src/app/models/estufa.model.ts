export interface EstufaOnline {
    id: string;
    lastSeen: string;
    variables: {
        lum: number | null;
        temperatura: number | null;
        um_ar: number | null;
        um_solo: number | null;
    };
}

export interface EstufaModel {
    id: string;
    name?: string;
    lastSeen: string;
    status: string;
    class: string;
    variables: VariableModel[];
}

export interface VariableModel {
    id: string;
    name: string;
    value: number | null;
    icon?: string;
    status: 'ideal' | 'no-ideal' | '';
    min: number;
    max: number;
}