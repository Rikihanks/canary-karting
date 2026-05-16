export interface Pilot {
    name: string;
    team: string;
    photo?: string;
    division: number;
    season: string;
    championship?: string;
    dotdTimes?: number;
}

export interface Result {
    id?: number;
    pilot: string;
    id_circuito: string;
    date: string;
    division: number;
    pos_clasificacion?: number;
    pos_final?: number;
    tiempo_vuelta?: string;
    es_vuelta_rapida?: number;
    condicion?: string;
    investigating?: number;
    replaces?: string;
    tiempo_qualy?: string;
    temporada?: string;
    sancion?: number;
    amonestacion?: number;
    kart?: string;
}

export interface Team {
    name: string;
    logo?: string;
}

export interface CalendarEvent {
    id_circuito: string;
    nombre: string;
    fecha: string;
    activa: string;
    terminada: string;
    division: number;
    temporada?: string;
}

export interface DotdSchedule {
    division: number;
    close_at: string;
    activated_at: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    tables?: string[];
    columns?: { name: string; type: string }[];
    schedules?: DotdSchedule[];
}

export interface ColumnInfo {
    name: string;
    type: string;
    pk: number;
    notnull: number;
}

export interface OneSignalResult {
    success: boolean;
    data?: Record<string, unknown>;
    error?: string;
}
