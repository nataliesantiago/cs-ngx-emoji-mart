export interface Configuracion {
    idtbl_configuracion: number;
    nombre: string;
    valor: string;
    fecha_creacion: Date
    id_usuario_ultima_modificacion: number;
    fecha_utlima_actualizacion: Date;
}


export interface AudioControls {
    reproduciendo:boolean;
    segundo:number;
    min:number;
    max:number;
}