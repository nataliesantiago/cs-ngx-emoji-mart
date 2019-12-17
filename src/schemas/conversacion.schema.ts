import { Observable, Subscription } from "rxjs";
import { User } from "./user.schema";
import { Experto } from "./xhr.schema";
import { AudioControls } from "./interfaces";
import { Mensaje } from "./mensaje.schema";
import { FormControl } from "@angular/forms";



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
    nombre_producto;
    id_busqueda;
    texto_busqueda;
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
    url_llamada: string;
    llamada_activa: boolean;
    id_llamada: number;
    buscando_llamada: boolean;
    viendo_supervisor: boolean = false;
    alarma_nlp: boolean;
    transfiriendo: boolean;
    es_despedida: boolean;
    conversacion_recomendada: boolean;
    muestra_boton_recomendacion: boolean;
    muestra_interfaz_recomendacion: boolean;
    encuesta_realizada: boolean;
    mostrar_descarga_chat: boolean;
    buscando_texto: boolean = false;
    texto_busqueda_mensajes: FormControl;
    cant_coincidencias: number;
    historial: Array<any>;
    primera_consulta: string;
    busqueda_interna: string;
    expert_chat: any;
    primera_vez: boolean;
    iniciando_grabacion: boolean;
    no_encontro_experto: boolean;
    tiempo_en_conversacion: number;
    tiempo_en_fila: number;
    fecha_asignacion: Date;
    cerro_experto: boolean = false;
    cerrado_inactividad: boolean;
    mensaje_inactividad: string;
    esta_seleccionado: boolean;
    constructor(id_usuario?, tipo_conversacion?, codigo?) {
        this.id_usuario_creador = id_usuario;
        this.id_tipo_conversacion = tipo_conversacion;
        this.codigo = codigo;
    }
}
