import { User } from "./user.schema";
import { AudioControls } from "./interfaces";

export class Mensaje {
    id_usuario: number;
    tipo_mensaje: number;
    url: string;
    es_archivo: boolean;
    es_nota_voz: boolean;
    fecha_mensaje: any;
    intencion_mensaje: any;
    texto: string;
    id_conversacion: number;
    codigo: string;
    user: User;
    muestra_hora: boolean = true;
    id: string;
    estado: number;
    tipo_archivo: number;
    audioControls: AudioControls;
    audio: HTMLAudioElement;
    duracion: number;
    nombre_archivo: string;
    constructor(id_usuario?, tipo_mensaje?, url?) {
        this.id_usuario = id_usuario;
        this.tipo_mensaje = tipo_mensaje;
        this.url = url;

    }
}

