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
    comandos?: Array<ComandoShortcut>;
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
    texto_tmp?: string;
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

export interface Emergencia {
    idtbl_consultas_sos: number;
    id_usuario_emergencia: number;
    fecha_emergencia: Date;
    id_usuario_operador: number;
    motivo_emergencia: string;
    fecha_emergencia_cerrada: Date;
    fecha_emergencia_cerrada_operador: Date;
}

export interface InformacionCorreo {
    correo_cliente: string;
    nombre_cliente: string;
    correo_experto: string;
    nombre_experto: string;
    url_foto: string;
    busqueda: string;
    mensajes: Array<any>;
}

export interface MensajeAutomatico {
    texto: string;
    timeout: number;
    id_tipo_mensaje: number;
    fecha_creacion: Date;
    fecha_ultima_modificacion: Date;
    id_usuario_modificacion: number;
    timeout_tmp: number;
    texto_tmp: string;
}

export interface EstadoExperto {
    idtbl_estado_experto: number;
    nombre: string;
    es_modificable: string;
    id_usuario_modificador: number;
}
