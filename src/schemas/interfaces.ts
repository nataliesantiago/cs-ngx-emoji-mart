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

export interface ShortCut {
    idtbl_shortcut_operador?: number;
    id_usuario?: number;
    guion?: string;
    fecha_creacion?: Date;
    id_guion?: number;
    activo: boolean;
    error?: boolean;
    comando?: number;
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    comandos?:Array<ComandoShortcut>;
}

export interface ComandoShortcut {
    id_shortcut?: number;
    comando?: number;
    orden?: number;
    key?: string;
}

export interface GuionChat {
    idtbl_guion_chat?: number;
    texto?: string;
    id_usuario_creador?: number;
    activo: boolean;
    fecha_creacion?: Date;
    id_usuario_ultima_modificacion?: number;
    fecha_ultima_modificacion?: Date;
}

export interface MotivoCierreChat {
    idtbl_motivo_cierre_chat?: number;
    name?: string;
    create_user_id?: number;
    create_date?: Date;
    update_last_user_id?: number;
    update_date?: Date;
    active: boolean;
}
