import { Observable } from "rxjs";
import { User } from "./user.schema";
import { Experto } from "./xhr.schema";
import { AudioControls } from "./interfaces";



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
    minimizado: boolean;
    expandido: boolean;
    focuseado: boolean;
    mnesajes_nuevos: boolean;
    constructor(id_usuario?, tipo_conversacion?, codigo?) {
        this.id_usuario_creador = id_usuario;
        this.id_tipo_conversacion = tipo_conversacion;
        this.codigo = codigo;
    }
}
