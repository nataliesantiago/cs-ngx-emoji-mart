import { FormControl } from "@angular/forms";

export interface Configuracion {
    idtbl_configuracion: number;
    nombre: string;
    valor: string;
    fecha_creacion: Date
    id_usuario_ultima_modificacion: number;
    fecha_utlima_actualizacion: Date;
}


export interface AudioControls {
    reproduciendo: boolean;
    segundo: number;
    min: number;
    max: number;
}


export interface ExtensionArchivoChat {
    idtbl_extension_archivo_chat?: number;
    extension: string;
    megabytes_maximos: number;
    id_usuario_creador?: number;
    fecha_creacion?: Date;
    activo?: boolean;
    id_usuario_ultima_modificacion?: number;
    fecha_ultima_modificacion?: Date;
    editando?: boolean;
    control_megabytes?: FormControl;
    megas_tmp?: number;
}


export interface IntencionChat {
    idbl_intencion_chat?: number
    id_usuario?: number;
    frase?: string;
    activo?: boolean;
    fecha_creacion?: Date;
    id_categoria_experticia?: number;
    nombre_categoria?: string;
}

export interface CategoriaExperticia {
    idtbl_categoria_experticia: number;
    nombre: string;
    fecha_creacion: Date;
    activo: boolean;
}
