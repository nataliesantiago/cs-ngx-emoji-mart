

/**
 * @param  {number} id_usuario
 * @param  {number} tipo_conversacion
 * @param  {string} codigo
 * @description Clase para las conversaciones
 */
export class Conversacion {
    id_usuario_creador;
    codigo;
    id_estado_conversacion;
    id_experto_actual;
    id_tipo_conversacion;
    id_usuario_cierra;
    id_producto;
    id_busqueda;
    fecha_creacion;
    constructor(id_usuario, tipo_conversacion, codigo) {
        this.id_usuario_creador = id_usuario;
        this.id_tipo_conversacion = tipo_conversacion;
        this.codigo = codigo;
    }
}
