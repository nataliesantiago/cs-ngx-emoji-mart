import { Observable, Subscription } from "rxjs";
import { User } from "./user.schema";
import { Experto } from "./xhr.schema";
import { AudioControls } from "./interfaces";
import { Mensaje } from "./mensaje.schema";



/**
 * @param  {number} id_usuario
 * @param  {number} tipo_conversacion
 * @param  {string} codigo
 * @description Clase para las conversaciones
 */
export class Conversacion {
    id: string;
    idtbl_conversacion;
    id_usuario_creador;
    codigo;
    id_estado_conversacion;
    id_experto_actual;
    nombre_experto_actual;
    id_tipo_conversacion;
    id_usuario_cierra;
    id_producto;
    id_busqueda;
    fecha_creacion;
    texto_mensaje: string;
    asesor_actual: User;
    messages: Observable<any>;
    mensajes = [];
    scroll;
    filas: Array<any>;
    no_hay_filas: string;
    expertos: Array<Experto> = [];
    url_foto: string;
    cliente: User;
    ocultar_nuevos_mensajes: boolean = true;
    archivo_adjunto: any;
    cargando_archivo: boolean = false;
    grabando_nota: boolean = false;
    cuenta_regresiva: string;
    interval_grabando: any;
    mediaRecorder: any;
    nodo_audio: any;
    minimizado: boolean;
    expandido: boolean;
    focuseado: boolean;
    mensajes_nuevos: boolean;
    timeout_escribiendo: any;
    usuarios_escribiendo: Array<any>;
    mostrar_datos_cliente: boolean;
    mostrar_emojis: boolean;
    notas_voz: boolean;
    ultimo_mensaje: Mensaje;
    agrandado: boolean;
    inicia_grabacion: Date;
    tiempo_cola: boolean;
    cantidad_mensajes_nuevos = 0;
    codigo_chat: string;
    listener_conversacion: Subscription;
    listener_mensajes: Subscription;
    transferido: boolean;
    interval_tiempo_cola: any;
    mostrar_encuesta: boolean;
    constructor(id_usuario?, tipo_conversacion?, codigo?) {
        this.id_usuario_creador = id_usuario;
        this.id_tipo_conversacion = tipo_conversacion;
        this.codigo = codigo;
    }
}
